/**
 * SEETECH AI — Block Validation Layer
 * =====================================
 * Never trust raw LLM JSON directly.
 * All AI blocks MUST pass validation before being rendered.
 *
 * Validation rules per block type ensure:
 * - payload existence
 * - schema integrity
 * - chart structure integrity
 * - KPI value format
 * - malformed array protection
 * - invalid type rejection
 */

/**
 * Core block shape validator.
 * Every block must have: type (string), version (string), payload (object).
 */
function validateBaseBlock(block) {
  if (!block || typeof block !== "object") return false;
  if (typeof block.type !== "string" || !block.type.trim()) return false;
  if (!block.payload || typeof block.payload !== "object") return false;
  return true;
}

// ─── Individual Block Validators ──────────────────────────────────────────────

function validateKpiCard(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.metrics) || payload.metrics.length === 0)
    return false;
  for (const metric of payload.metrics) {
    if (typeof metric.label !== "string") return false;
    if (metric.value === undefined || metric.value === null) return false;
  }
  return true;
}

function validateChart(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  const chartType = (payload.chartType || payload.type || "").toLowerCase();
  const validTypes = ["line", "bar", "area", "pie", "radar", "scatter", "composed"];
  
  if (!chartType || !validTypes.includes(chartType)) return false;
  
  // Support both 'dataset' (Legacy) and 'series' (New)
  if (!Array.isArray(payload.data) && !Array.isArray(payload.series) && !Array.isArray(payload.dataset)) 
    return false;
    
  return true;
}

function validateInsight(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (typeof payload.message !== "string" || !payload.message.trim())
    return false;
  return true;
}

function validateWarning(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (typeof payload.message !== "string" || !payload.message.trim())
    return false;
  return true;
}

function validateRecommendation(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.items) || payload.items.length === 0) return false;
  return true;
}

function validateEngineeringTable(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.headers) || payload.headers.length === 0)
    return false;
  if (!Array.isArray(payload.rows) || payload.rows.length === 0) return false;
  return true;
}

function validateSystemStatus(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.systems) || payload.systems.length === 0)
    return false;
  for (const sys of payload.systems) {
    if (typeof sys.name !== "string") return false;
    if (typeof sys.status !== "string") return false;
  }
  return true;
}

function validateEnergyFlow(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.nodes) || payload.nodes.length === 0) return false;
  return true;
}

// Legacy recharts backwards compatibility
function validateRechartVisualize(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!payload.type || !payload.dataset) return false;
  return true;
}

function validateLiveKpi(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (typeof payload.healthScore !== 'number') return false;
  if (!Array.isArray(payload.metrics)) return false;
  return true;
}

function validatePlantOverview(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!payload.plantName || typeof payload.overallEfficiency !== 'number') return false;
  return true;
}

function validateFlowDiagram(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.nodes) || !Array.isArray(payload.flows)) return false;
  return true;
}

function validateAlert(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.alerts)) return false;
  return true;
}

function validateReport(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!payload.title || !Array.isArray(payload.sections)) return false;
  return true;
}

function validateSankeyFlow(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.nodes) || !Array.isArray(payload.links)) return false;
  return true;
}

function validateProcessDiagram(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.nodes) || !Array.isArray(payload.edges)) return false;
  return true;
}

function validatePredictiveAlert(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!payload.title || !payload.prediction) return false;
  return true;
}

// ─── Validator Registry ────────────────────────────────────────────────────────

function validateTwinViewer(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.nodes) || !Array.isArray(payload.links)) return false;
  return true;
}

function validateOptiPanel(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.strategies)) return false;
  return true;
}

function validateSimResult(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.scenarios)) return false;
  return true;
}

function validateRadarDashboard(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!Array.isArray(payload.kpis)) return false;
  return true;
}

function validateIndustrialChart(block) {
  if (!validateBaseBlock(block)) return false;
  const { payload } = block;
  if (!payload.chartType || typeof payload.title !== "string" || !Array.isArray(payload.series)) {
    return false;
  }
  return true;
}

// ─── Validator Registry ────────────────────────────────────────────────────────

const VALIDATORS = {
  industrial_chart: validateIndustrialChart,
  kpiCard: validateKpiCard,
  liveKpi: validateLiveKpi,
  plantOverview: validatePlantOverview,
  flowDiagram: validateFlowDiagram,
  twinViewer: validateTwinViewer,
  optiPanel: validateOptiPanel,
  simResult: validateSimResult,
  radarDashboard: validateRadarDashboard,
  sankeyFlow: validateSankeyFlow,
  processDiagram: validateProcessDiagram,
  predictiveAlert: validatePredictiveAlert,
  alert: validateAlert,
  report: validateReport,
  chart: validateChart,
  insight: validateInsight,
  warning: validateWarning,
  recommendation: validateRecommendation,
  engineeringTable: validateEngineeringTable,
  systemStatus: validateSystemStatus,
  energyFlow: validateEnergyFlow,
  rechartVisualize: validateRechartVisualize,
  // Future blocks default to base validation
  timeline: validateBaseBlock,
  anomalyMap: validateBaseBlock,
  predictiveForecast: validateBaseBlock,
  heatmap: validateBaseBlock,
  equipmentTree: validateBaseBlock,
  operationalRisk: validateBaseBlock,
  rootCause: validateBaseBlock,
};

/**
 * validateBlock
 * =============
 * Validates a single AI block before rendering.
 * Returns { valid: boolean, reason: string | null }
 *
 * @param {object} block - The raw parsed block object
 * @returns {{ valid: boolean, reason: string|null }}
 */
export function validateBlock(block) {
  if (!block || typeof block !== "object") {
    return { valid: false, reason: "Block is not an object" };
  }

  const validator = VALIDATORS[block.type];
  if (!validator) {
    return {
      valid: false,
      reason: `No validator found for block type: "${block.type}"`,
    };
  }

  const isValid = validator(block);
  if (!isValid) {
    return {
      valid: false,
      reason: `Block payload failed schema validation for type: "${block.type}"`,
    };
  }

  return { valid: true, reason: null };
}

/**
 * validateAndFilterBlocks
 * ========================
 * Validates an array of AI blocks and returns only valid ones.
 * Invalid blocks are silently dropped (no crash).
 *
 * @param {object[]} blocks
 * @returns {object[]}
 */
export function validateAndFilterBlocks(blocks = []) {
  return blocks.filter((block) => {
    const { valid, reason } = validateBlock(block);
    if (!valid) {
      console.warn(`[AIBlock Validator] Dropped invalid block:`, reason, block);
    }
    return valid;
  });
}
