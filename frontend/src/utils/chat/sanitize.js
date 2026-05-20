/**
 * Centralized utility for enterprise-grade assistant output sanitization.
 * Strips internal reasoning, chain-of-thought, and heuristic preambles.
 */

const TAGGED_REASONING_BLOCKS = [
  "thinking",
  "thought",
  "thought_chain",
  "think",
  "reasoning",
  "analysis",
  "planning",
  "internal",
  "chain_of_thought",
  "reflection",
];

const UNTAGGED_REASONING_PREFIXES = [
  /^the user (said|asked|wrote|is asking|mentioned|wants|needs|seems)/i,
  /^the user('s|s') (message|question|query|input|request)/i,
  /^(let me|i need to|i should|i will|i am going to) (think|respond|analyze|consider|process|formulate|craft|write)/i,
  /^(analyzing|processing|thinking|considering|formulating|planning|evaluating) (the|this|user|message|question|query)/i,
  /^(okay|alright|sure|well)[,.]? (let me|i'll|i will|the user)/i,
  /^this (is|looks like|appears to be) (a|an) (casual|simple|basic|straightforward|greeting|question)/i,
  /^(my response|my answer|the response|the answer) (should|will|needs to|must)/i,
  /^internal (note|reasoning|analysis|thought|processing):/i,
  /^\[internal\]/i,
  /^\[thinking\]/i,
  /^\[reasoning\]/i,
  /^\[analysis\]/i,
  /^### (Reasoning|Analysis|Thought|Thinking)/i,
];

/**
 * Strips reasoning content from assistant message text.
 * Handles both complete blocks and unclosed streaming tags.
 * 
 * @param {string} text - Raw assistant content.
 * @returns {string} - Sanitized content.
 */
export function sanitizeAssistantOutput(text) {
  if (!text || typeof text !== "string") return text;

  let cleaned = text;

  // 1. Remove complete tagged reasoning blocks
  for (const tag of TAGGED_REASONING_BLOCKS) {
    const completeRe = new RegExp(`<${tag}[\\s\\S]*?>[\\s\\S]*?<\\/${tag}[\\s\\S]*?>`, "gi");
    cleaned = cleaned.replace(completeRe, "");
  }

  // 2. Handle unclosed (streaming) tags
  // We strip from the start of an opening tag to the end of the string if it's not closed.
  for (const tag of TAGGED_REASONING_BLOCKS) {
    const openRe = new RegExp(`<${tag}[\\s>]`, "i");
    const closeRe = new RegExp(`<\\/${tag}[\\s>]`, "i");
    if (openRe.test(cleaned) && !closeRe.test(cleaned)) {
      cleaned = cleaned.replace(new RegExp(`<${tag}[\\s\\S]*?>[\\s\\S]*`, "i"), "");
    }
  }

  // 3. Strip untagged reasoning preambles line-by-line
  const lines = cleaned.split("\n");
  let preambleEnded = false;
  const filteredLines = lines.filter((line) => {
    if (preambleEnded) return true;
    const trimmed = line.trim();
    if (!trimmed) return false; // Ignore blank lines in preamble

    const isReasoning = UNTAGGED_REASONING_PREFIXES.some((re) => re.test(trimmed));
    if (isReasoning) return false;

    preambleEnded = true;
    return true;
  });

  let result = filteredLines.join("\n").trim();

  // 4. Final safety checks for remaining markdown headers that look like internal planning
  result = result.replace(/^#+ (Internal Analysis|Hidden Planning|Model Reasoning)[\s\S]*?(?=\n#+ |$)/gim, "");

  const finalResult = result.trim();

  // --- SEETECH FAILSAFE (v6.2) ---
  // If sanitization removes everything from a non-empty string, fallback to original
  // to prevent "silent failure" or infinite thinking states in the UI.
  if (text.trim().length > 0 && finalResult.length === 0) {
    console.warn("[SANITIZER] Frontend sanitization resulted in empty string. Falling back to original.");
    return text;
  }

  return finalResult;
}
