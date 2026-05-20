/**
 * SEETECH AI — Enterprise Response Parsing Engine
 * ================================================
 * Streaming-safe parser that intercepts AI block JSON from the response stream,
 * prevents raw JSON from ever reaching the UI, and emits validated AI blocks
 * for rendering through the centralized AIBlock registry.
 *
 * Block Metadata Standard:
 * {
 *   "type": "kpiCard",
 *   "version": "1.0",
 *   "priority": "warning",
 *   "title": "COP Performance",
 *   "payload": { ... }
 * }
 *
 * Supported block types (current + future-proofed):
 * kpiCard | chart | insight | warning | recommendation |
 * engineeringTable | systemStatus | energyFlow |
 * timeline | anomalyMap | predictiveForecast | sankeyFlow |
 * heatmap | equipmentTree | operationalRisk | rootCause
 */

// All recognized block type keys the parser should intercept.
const KNOWN_BLOCK_TYPES = new Set([
  "industrial_chart",
  "kpiCard",
  "liveKpi",
  "plantOverview",
  "flowDiagram",
  "alert",
  "report",
  "chart",
  "insight",
  "warning",
  "recommendation",
  "engineeringTable",
  "systemStatus",
  "energyFlow",
  "timeline",
  "anomalyMap",
  "predictiveForecast",
  "sankeyFlow",
  "heatmap",
  "equipmentTree",
  "operationalRisk",
  "rootCause",
  // Legacy recharts support (backwards compat)
  "rechartVisualize",
]);

/**
 * Priority order for rendering. Lower number = rendered first.
 */
export const BLOCK_PRIORITY = {
  critical: 1,
  warning: 2,
  kpiCard: 3,
  chart: 4,
  insight: 5,
  recommendation: 6,
  engineeringTable: 7,
  systemStatus: 8,
  energyFlow: 9,
};

/**
 * Attempt to extract all complete, top-level JSON objects from a string.
 * Returns an array of { raw: string, parsed: object } for each found block.
 * Stops at malformed JSON — does NOT throw.
 */
function extractJsonBlocks(text) {
  const blocks = [];
  let i = 0;

  while (i < text.length) {
    if (text[i] !== "{") {
      i++;
      continue;
    }

    // Found a potential JSON start — try to find the matching closing brace
    let depth = 0;
    let inString = false;
    let escape = false;
    let start = i;

    for (let j = i; j < text.length; j++) {
      const ch = text[j];
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\" && inString) {
        escape = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;

      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth === 0) {
          const raw = text.slice(start, j + 1);
          try {
            const parsed = JSON.parse(raw);
            
            let normalized = null;
            if (parsed && typeof parsed === "object") {
              if (typeof parsed.type === "string" && KNOWN_BLOCK_TYPES.has(parsed.type)) {
                // Already standard format
                normalized = parsed;
              } else if (typeof parsed.chartType === "string" || Array.isArray(parsed.series)) {
                // User's mandatory industrial_chart format!
                normalized = {
                  type: "industrial_chart",
                  version: "1.0",
                  payload: parsed
                };
              } else {
                // Check if any root key is a known block type
                const rootKeys = Object.keys(parsed);
                const blockType = rootKeys.find(key => KNOWN_BLOCK_TYPES.has(key));
                if (blockType) {
                  normalized = {
                    type: blockType,
                    version: "1.0",
                    payload: parsed[blockType]
                  };
                }
              }
            }

            if (normalized) {
              let actualStart = start;
              let actualEnd = j + 1;

              // Check if wrapped in markdown code fences like ```industrial_chart ... ```
              const before = text.slice(0, start);
              const fenceMatch = before.match(/```[a-zA-Z0-9_-]*\s*$/);
              if (fenceMatch) {
                actualStart = fenceMatch.index;
                const after = text.slice(j + 1);
                const closeMatch = after.match(/^\s*```/);
                if (closeMatch) {
                  actualEnd = (j + 1) + closeMatch[0].length;
                }
              }

              blocks.push({ raw: text.slice(actualStart, actualEnd), parsed: normalized, start: actualStart, end: actualEnd });
            }
          } catch {
            // Not valid JSON — skip this opening brace
          }
          i = j + 1;
          break;
        }
      }
    }

    // If we didn't advance (no match found), move forward
    if (i === start) i++;
  }

  return blocks;
}

/**
 * parseAIResponse
 * ================
 * Takes a full or partial AI response string and splits it into:
 * - `markdownParts`: array of clean text/markdown segments
 * - `blocks`: array of validated AI block objects
 *
 * @param {string} text - The raw AI response text
 * @param {boolean} isStreaming - If true, incomplete/trailing JSON is withheld from markdown
 * @returns {{ markdownParts: string[], blocks: object[] }}
 */
export function parseAIResponse(text = "", isStreaming = false) {
  if (!text) return { markdownParts: [""], blocks: [] };

  const extractedBlocks = extractJsonBlocks(text);
  const blocks = [];
  const markdownParts = [];

  let cursor = 0;
  const validBlocks = extractedBlocks.filter(({ parsed }) =>
    KNOWN_BLOCK_TYPES.has(parsed.type)
  );

  for (const { raw, parsed, start, end } of validBlocks) {
    // Add preceding text as markdown
    const preceding = text.slice(cursor, start).trim();
    if (preceding) markdownParts.push(preceding);

    blocks.push(parsed);
    cursor = end;
  }

  // Handle remaining text after last block
  let remaining = text.slice(cursor);

  if (isStreaming && remaining.includes("{")) {
    // If streaming and trailing text starts a potential JSON block, hide it
    // SEETECH HARDENING (v6.1): Only hide if the brace is likely starting a block (at start or after newline/whitespace)
    const openBraceIdx = remaining.lastIndexOf("{");
    const charBefore = openBraceIdx > 0 ? remaining[openBraceIdx - 1] : "\n";
    
    if (charBefore === "\n" || charBefore === " " || charBefore === "\t" || openBraceIdx === 0) {
      const safeText = remaining.slice(0, openBraceIdx).trim();
      if (safeText) markdownParts.push(safeText);
      // The rest is buffered (hidden) — it may complete on next chunk
    } else {
      // It's likely part of a formula or technical text (e.g. "x{i}")
      if (remaining.trim()) markdownParts.push(remaining);
    }
  } else {
    if (remaining.trim()) markdownParts.push(remaining);
  }

  if (markdownParts.length === 0 && blocks.length === 0 && text.trim()) {
    return { markdownParts: [text], blocks: [] };
  }
  return { markdownParts, blocks };
}

/**
 * StreamingAccumulator
 * ====================
 * Maintains a rolling buffer of incoming stream chunks and provides
 * a safe, progressive view of parsed content at each step.
 *
 * Usage:
 *   const acc = new StreamingAccumulator();
 *   // On each new chunk:
 *   const { markdownParts, blocks } = acc.push(newChunk);
 *   // On stream complete:
 *   const { markdownParts, blocks } = acc.flush();
 */
export class StreamingAccumulator {
  constructor() {
    this.buffer = "";
  }

  /**
   * Push a new chunk into the accumulator.
   * Returns a safe partial render state — hides incomplete JSON.
   */
  push(chunk) {
    this.buffer += chunk;
    return parseAIResponse(this.buffer, true);
  }

  /**
   * Flush the accumulator. Called when the stream is complete.
   * Forces rendering of any remaining buffered content.
   */
  flush() {
    const result = parseAIResponse(this.buffer, false);
    this.buffer = "";
    return result;
  }

  reset() {
    this.buffer = "";
  }
}

/**
 * Sort blocks by their operational priority.
 * Critical and warning blocks render first.
 */
export function sortBlocksByPriority(blocks = []) {
  return [...blocks].sort((a, b) => {
    const pa = BLOCK_PRIORITY[a.priority] ?? BLOCK_PRIORITY[a.type] ?? 99;
    const pb = BLOCK_PRIORITY[b.priority] ?? BLOCK_PRIORITY[b.type] ?? 99;
    return pa - pb;
  });
}
