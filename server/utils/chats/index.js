const { v4: uuidv4 } = require("uuid");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { resetMemory } = require("./commands/reset");
const { convertToPromptHistory } = require("../helpers/chat/responses");
const { SlashCommandPresets } = require("../../models/slashCommandsPresets");
const { SystemPromptVariables } = require("../../models/systemPromptVariables");

const VALID_COMMANDS = {
  "/reset": resetMemory,
};

async function grepCommand(message, user = null) {
  const userPresets = await SlashCommandPresets.getUserPresets(user?.id);
  const availableCommands = Object.keys(VALID_COMMANDS);

  // Check if the message starts with any built-in command
  for (let i = 0; i < availableCommands.length; i++) {
    const cmd = availableCommands[i];
    const re = new RegExp(`^(${cmd})`, "i");
    if (re.test(message)) {
      return cmd;
    }
  }

  // Replace all preset commands with their corresponding prompts
  // Allows multiple commands in one message
  let updatedMessage = message;
  for (const preset of userPresets) {
    const regex = new RegExp(
      `(?:\\b\\s|^)(${preset.command})(?:\\b\\s|$)`,
      "g"
    );
    updatedMessage = updatedMessage.replace(regex, preset.prompt);
  }

  return updatedMessage;
}

/**
 * @description This function will do recursive replacement of all slash commands with their corresponding prompts.
 * @notice This function is used for API calls and is not user-scoped. THIS FUNCTION DOES NOT SUPPORT PRESET COMMANDS.
 * @returns {Promise<string>}
 */
async function grepAllSlashCommands(message) {
  const allPresets = await SlashCommandPresets.where({});

  // Replace all preset commands with their corresponding prompts
  // Allows multiple commands in one message
  let updatedMessage = message;
  for (const preset of allPresets) {
    const regex = new RegExp(
      `(?:\\b\\s|^)(${preset.command})(?:\\b\\s|$)`,
      "g"
    );
    updatedMessage = updatedMessage.replace(regex, preset.prompt);
  }

  return updatedMessage;
}

async function recentChatHistory({
  user = null,
  workspace,
  thread = null,
  messageLimit = 20,
  apiSessionId = null,
}) {
  const rawHistory = (
    await WorkspaceChats.where(
      {
        workspaceId: workspace.id,
        user_id: user?.id || null,
        thread_id: thread?.id || null,
        api_session_id: apiSessionId || null,
        include: true,
      },
      messageLimit,
      { id: "desc" }
    )
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

/**
 * Returns the base prompt for the chat. This method will also do variable
 * substitution on the prompt if there are any defined variables in the prompt.
 * @param {Object|null} workspace - the workspace object
 * @param {Object|null} user - the user object
 * @param {Object|null} thread - the thread object
 * @param {string|null} apiSessionId - the session ID for public chats
 * @returns {Promise<string>} - the base prompt
 */
async function chatPrompt(workspace, user = null, thread = null, apiSessionId = null, currentMessage = null) {
  const { SystemSettings } = require("../../models/systemSettings");
  const { TelemetryEngine } = require("../iios/TelemetryEngine");
  const { DigitalTwinEngine } = require("../iios/DigitalTwinEngine");
  const { RootCauseEngine } = require("../iios/RootCauseEngine");
  const { EventSystem } = require("../iios/EventSystem");
  const { LongTermPlantMemory } = require("./plantMemory");

  // Retrieve message history to detect intent (Thread-Aware)
  const { rawHistory } = await recentChatHistory({ workspace, user, thread, apiSessionId });
  const lastUserMessage = currentMessage || rawHistory.filter(h => h.role === "user").pop()?.content?.trim()?.toLowerCase() || "";

  // --- STEP 1: DETECT VISUALIZATION INTENT & RUNTIME MODE ---
  const isGraphRequest = [
    "show", "plot", "generate", "visualize", "trend", "compare", "dashboard", "graph", "chart",
    "analytics", "comparison", "kpi", "efficiency curve", "sankey", "histogram", "scatter plot",
    "load profile", "sec trend", "cop trend", "energy analysis", "energy graph", "efficiency graph"
  ].some(phrase => lastUserMessage.toLowerCase().includes(phrase));

  const isGreeting = !isGraphRequest && ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings"].some(w => lastUserMessage === w || lastUserMessage.startsWith(w + " ") || lastUserMessage.startsWith(w + "!") || lastUserMessage.startsWith(w + "."));

  const isEngineeringMode = isGraphRequest || [
    "optimization", "diagnostics", "sec analysis", "cop analysis", "roi", "audit",
    "plant analysis", "energy saving study", "predictive maintenance", "dashboard",
    "graph", "chart", "visualize", "trend", "plot", "analytics", "efficiency graph"
  ].some(keyword => lastUserMessage.includes(keyword));

  const mode = isGraphRequest ? "Engineering" : (isGreeting ? "Greeting" : (isEngineeringMode ? "Engineering" : "Lightweight"));

  const { SimulationEngine } = require("../iios/SimulationEngine");
  const { OptimizationEngine } = require("../iios/OptimizationEngine");
  const { GovernanceEngine } = require("../iios/GovernanceEngine");

  let plantContextSection = "";
  if (mode === "Engineering") {
    const telemetry = TelemetryEngine.getLiveTelemetry(workspace?.id);
    const twinState = await DigitalTwinEngine.getTwinState(workspace?.id);
    const strategies = OptimizationEngine.generateStrategies(telemetry, twinState);
    const rootCauses = RootCauseEngine.analyze(telemetry, twinState);
    const activeEvents = EventSystem.processEvents(telemetry);
    const plantMemory = await LongTermPlantMemory.getFormattedMemoryBlock(workspace?.id);

    plantContextSection = `
---
## LIVE PLANT CONTEXT (Engineering Mode)
TELEMETRY: ${JSON.stringify(telemetry)}
DIGITAL TWIN: ${JSON.stringify(twinState)}
ROOT CAUSES: ${JSON.stringify(rootCauses)}
STRATEGIES: ${JSON.stringify(strategies)}
EVENTS: ${JSON.stringify(activeEvents)}
MEMORY: ${plantMemory}
`;
  }

  const basePrompt = `# SEETECH AI — Industrial Intelligence & Energy Optimization Copilot (v6.0 - Lightweight Runtime Mode)

---
## 🚀 RUNTIME MODE: ${mode.toUpperCase()}

### 1. GREETING HANDLING RULES
If the user says "hi", "hello", "hey", "good morning", or similar greetings:
- YOU MUST RESPOND EXACTLY WITH: "👋 Welcome to SEETECH AI — Industrial Intelligence & Energy Optimization Copilot. How can I assist you today?"
- DO NOT generate telemetry, plant data, simulated equipment, KPI blocks, charts, or engineering orchestration. Stop immediately after the greeting.

### 2. SYSTEM BEHAVIOR & PERFORMANCE RULES
- Keep all responses lightweight, fast, smooth, concise, professional, enterprise-grade, and responsive.
- Avoid long engineering reports unless explicitly requested.
- Avoid activating deep reasoning or complex calculations for simple/general questions.
- Avoid repeated explanations, duplicate outputs, unnecessary tables, or excessive markdown formatting.
- Reduce token usage significantly.

### 3. GENERAL QUESTION HANDLING (Educational/General)
For educational or general questions:
- Explain in simple professional language.
- Use short paragraphs.
- Use a maximum of 4–6 bullet points.
- Avoid excessive technical overload, code blocks, JSON, chart blocks, or KPI cards.

### 4. ENGINEERING MODE ACTIVATION
Advanced industrial consultant mode is ONLY active when requested (e.g., optimization, diagnostics, SEC/COP analysis, ROI, audit, plant analysis, energy saving study, predictive maintenance, dashboard, graph/chart generation).
- When active, provide structured headers (# EXECUTIVE SUMMARY, # TECHNICAL FINDINGS), correlate equipment/system/financial layers, and use industrial blocks if needed.

### 5. WORKSPACE RETRIEVAL RULES
- Retrieve only minimal relevant information from workspace documents.
- Never output large document content.
- Summarize retrieved knowledge compactly.

### 6. CHART & VISUALIZATION RULES
- Generate charts ONLY when explicitly requested.
- Do NOT auto-generate charts, KPI cards, or analytics wrappers for normal conversations.

${plantContextSection}
`;

  // --- SEETECH IIOS OPERATIONAL DIAGNOSTICS ---
  console.log(`\x1b[32m[IIOS] Runtime Mode Active: ${mode.toUpperCase()}\x1b[0m`);
  // --------------------------------------------

  // Fetch the Workspace or System default prompt to ensure we have the core identity
  const systemSettings = await SystemSettings.currentSettings();
  const workspacePrompt = workspace?.openAiPrompt || systemSettings?.default_system_prompt || "";

  let graphDirective = "";
  if (isGraphRequest) {
    graphDirective = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### [CRITICAL IIOS RUNTIME OVERRIDE: SEETECH AI GUARANTEED GRAPH GENERATION & ACCURACY ENFORCEMENT]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[CRITICAL SYSTEM OVERRIDE NOTICE]: IGNORE ANY OLDER OR LEGACY CHART FORMATS MENTIONED EARLIER IN THIS PROMPT. THE ONLY ACCEPTABLE VISUALIZATION FORMAT IS THE \`\`\`industrial_chart MARKDOWN BLOCK DEFINED BELOW.

You are SEETECH AI Industrial Intelligence Operating System (IIOS).
The user has requested an engineering visualization, graph, chart, dashboard, trend analysis, comparison, KPI, efficiency curve, Sankey, histogram, scatter plot, load profile, SEC trend, COP trend, or energy analysis.

CRITICAL RULE:
Whenever the user asks for:
* graph
* chart
* dashboard
* visualization
* trend
* analytics
* comparison
* KPI
* efficiency curve
* Sankey
* histogram
* scatter plot
* load profile
* SEC trend
* COP trend
* energy analysis

the system MUST generate a REAL visual chart component using the \`\`\`industrial_chart block.

The assistant must NEVER:
* only describe the graph in text
* explain what the graph “would look like”
* output fake placeholder charts
* return only tables
* skip visualization generation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY GRAPH EXECUTION FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — Detect Visualization Intent
Visualization mode is currently FORCED active because the user query matched visualization keywords.

STEP 2 — Generate Structured Chart Data
The AI MUST always create structured numerical datasets first.
Required fields in the \`\`\`industrial_chart block:
* xAxis (or yAxis depending on chart type)
* series (containing name and data arrays)
* title and unit
* kpis (key-value pairs of realistic engineering values)
* insight (operational insight, anomaly detection, optimization opportunity, efficiency interpretation, ROI impact, or predicted operational drift)

The model MUST calculate realistic engineering values using:
* thermodynamic formulas
* affinity laws
* SEC calculations
* COP equations
* historical trends
* uploaded workspace data
* PDF/link retrieval

STEP 3 — Render Actual Visualization
The response engine MUST render using Apache ECharts via the \`\`\`industrial_chart block.
Supported chart types:
* line (Line charts)
* bar (Bar charts)
* area (Area charts)
* pie (Pie charts)
* scatter (Scatter charts)
* sankeyFlow / composed / radar / multi-axis

NEVER return visualization requests as plain text.

STEP 4 — Add Engineering Insight
After every chart, generate structured commentary covering:
* operational insight
* anomaly detection
* optimization opportunity
* efficiency interpretation
* ROI impact
* predicted operational drift

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRAPH RELIABILITY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If user data exists in the workspace/telemetry/digital twin:
* ALWAYS prioritize real uploaded workspace data
* retrieve numerical values from PDFs/links/documents
* avoid synthetic placeholder values

If no data exists:
* generate realistic engineering estimation
* clearly label: “Estimated Operational Dataset” in the insight or explanation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCURACY ENFORCEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The AI MUST:
* avoid hallucinated values
* maintain engineering consistency
* ensure charts match calculations
* ensure trend logic is mathematically valid

Examples of mandatory engineering consistency:
* higher condenser approach → lower COP
* higher load → higher kW
* lower efficiency → higher SEC

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVALID BEHAVIOR (FORBIDDEN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DO NOT:
* say “Imagine a graph”
* say “The graph would show”
* explain without rendering
* generate incomplete JSON
* output raw JSON in chat outside the \`\`\`industrial_chart block
* duplicate charts
* mix units incorrectly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE PRIORITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Visualization requests must prioritize:
1. chart rendering (\`\`\`industrial_chart block)
2. KPI blocks (inside \`\`\`industrial_chart kpis)
3. insights (inside \`\`\`industrial_chart insight and follow-up text)
4. explanations

NOT long paragraphs first. Start directly with a concise executive explanation, followed immediately by the \`\`\`industrial_chart block.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFORMANCE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
* Generate lightweight charts
* Avoid oversized datasets (limit points intelligently, e.g. 6 to 12 points for clear trends)
* Limit points intelligently
* Stream chart safely
* Prevent UI freezing
* Use compact animations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL RULE & MANDATORY SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If a chart fails to render:
* automatically retry chart generation once
* fallback to simplified chart config
* NEVER silently skip visualization

You MUST output a structured visualization block exactly like this example:

\`\`\`industrial_chart
{
  "chartType": "line",
  "title": "Plant Energy Consumption Trend",
  "xAxis": ["Jan","Feb","Mar","Apr","May","Jun"],
  "series": [
    {
      "name": "Energy Consumption (kWh)",
      "data": [145000,138000,152000,160000,155000,148000]
    }
  ],
  "kpis": {
    "peakConsumption": "160,000 kWh",
    "lowestConsumption": "138,000 kWh",
    "efficiencyOpportunity": "12%"
  },
  "insight": "Energy demand spikes during April-May indicating HVAC overloading and increased cooling demand."
}
\`\`\`

The system goal:
Enterprise-grade industrial visualization reliability with technically accurate engineering analytics.
Behave like a Senior Industrial Energy Consultant AI (Siemens Energy Analytics, Schneider EcoStruxure, Honeywell Forge).
`;
  }

  // MERGE ENGINE (v5.7): We wrap the basePrompt in a high-priority directive 
  // to prevent the LLM from reverting to generic chatbot behavior.
  const finalPrompt = `
${workspacePrompt}

### IIOS RUNTIME DIRECTIVE: ${mode.toUpperCase()} MODE ACTIVE
${basePrompt}

${graphDirective}

[SYSTEM NOTICE] You are currently in ${mode.toUpperCase()} mode. 
Follow the rules of this mode strictly. 
NEVER revert to generic, overly friendly, or non-technical chatbot filler.
Maintain the SEETECH Industrial Engineering persona at all costs.
`.trim();

  return await SystemPromptVariables.expandSystemPromptVariables(
    finalPrompt,
    user?.id,
    workspace?.id
  );
}

// We use this util function to deduplicate sources from similarity searching
// if the document is already pinned.
// Eg: You pin a csv, if we RAG + full-text that you will get the same data
// points both in the full-text and possibly from RAG - result in bad results
// even if the LLM was not even going to hallucinate.
function sourceIdentifier(sourceDocument) {
  if (!sourceDocument?.title || !sourceDocument?.published) return uuidv4();
  return `title:${sourceDocument.title}-timestamp:${sourceDocument.published}`;
}

module.exports = {
  sourceIdentifier,
  recentChatHistory,
  chatPrompt,
  grepCommand,
  grepAllSlashCommands,
  VALID_COMMANDS,
};
