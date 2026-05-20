/**
 * SEETECH AI — Centralized AI Block Registry
 * ===========================================
 * ALL AI block rendering routes through this file.
 * No scattered rendering logic in HistoricalMessage or PromptReply.
 *
 * To add a new block type:
 * 1. Create the component in /AIBlocks/
 * 2. Import it here
 * 3. Register it in BLOCK_RENDERERS
 * 4. Add its validator in /utils/ai/validators.js
 * 5. Add its type to KNOWN_BLOCK_TYPES in responseParser.js
 */

import React from "react";
import { memo } from "react";
import { withSafeBoundary } from "./SafeRenderBoundary";
import { validateAndFilterBlocks } from "@/utils/ai/validators";
import { sortBlocksByPriority } from "@/utils/ai/responseParser";

// ─── Block Component Imports ─────────────────────────────────────────────────
import KPICard from "./KPICard";
import InsightCard from "./InsightCard";
import WarningCard from "./WarningCard";
import RecommendationCard from "./RecommendationCard";
import SystemStatusCard from "./SystemStatusCard";
import EngineeringTable from "./EngineeringTable";
import ChartBlock from "./ChartBlock";
import LiveKPIPanel from "./LiveKPIPanel";
import PlantOverviewDashboard from "./PlantOverviewDashboard";
import SystemFlowDiagram from "./SystemFlowDiagram";
import AlertCenter from "./AlertCenter";
import EngineeringReport from "./EngineeringReport";
import SankeyEnergyFlow from "./SankeyEnergyFlow";
import ProcessDiagram from "./ProcessDiagram";
import PredictiveAlert from "./PredictiveAlert";
import TwinViewer from "./TwinViewer";
import OptiPanel from "./OptiPanel";
import SimResult from "./SimResult";

// Legacy Rechart support (existing component, wrapped for safety)
import RechartVisualize from "../WorkspaceChat/ChatContainer/ChatHistory/HistoricalMessage/RechartVisualize";

// ─── Chart Block Adapter ─────────────────────────────────────────────────────
// The 'chart' block type uses the RechartVisualize component but normalizes
// the block schema into the shape it expects.
function ChartBlockAdapter({ block }) {
  const { payload } = block;
  // Normalize payload for ChartBlock
  const chartData = {
    type: payload.type || payload.chartType || "line",
    title: payload.title || block.title || "Industrial Analytics",
    xAxis: payload.xAxis || (payload.data || payload.dataset || []).map(d => d.name || d.label),
    series: payload.series || [{
      name: payload.seriesName || "Value",
      data: (payload.data || payload.dataset || []).map(d => d.value || d.amount || d[Object.keys(d)[1]]),
    }],
    insight: payload.insight || payload.caption || block.caption,
    unit: payload.unit || ""
  };
  return <ChartBlock chart={chartData} kpis={payload.kpis} />;
}

// Legacy rechartVisualize blocks (emitted by old system prompt or agent tools)
function LegacyRechartAdapter({ block }) {
  return <RechartVisualize data={block.payload} />;
}

// ─── Block Registry ───────────────────────────────────────────────────────────
// Every block type maps to a SafeBoundary-wrapped component.
// Adding a new block type? Just add it here — zero changes to chat components.

const BLOCK_RENDERERS = {
  industrial_chart: withSafeBoundary(ChartBlockAdapter, "Industrial Chart could not be rendered."),
  kpiCard: withSafeBoundary(KPICard, "KPI card could not be rendered."),
  liveKpi: withSafeBoundary(LiveKPIPanel, "Live KPI panel could not be rendered."),
  plantOverview: withSafeBoundary(PlantOverviewDashboard, "Plant dashboard could not be rendered."),
  flowDiagram: withSafeBoundary(SystemFlowDiagram, "System diagram could not be rendered."),
  alert: withSafeBoundary(AlertCenter, "Alert center could not be rendered."),
  report: withSafeBoundary(EngineeringReport, "Report could not be rendered."),
  chart: withSafeBoundary(ChartBlockAdapter, "Chart could not be rendered."),
  insight: withSafeBoundary(InsightCard, "Insight could not be rendered."),
  warning: withSafeBoundary(WarningCard, "Warning could not be rendered."),
  recommendation: withSafeBoundary(RecommendationCard, "Recommendation could not be rendered."),
  engineeringTable: withSafeBoundary(EngineeringTable, "Table could not be rendered."),
  systemStatus: withSafeBoundary(SystemStatusCard, "System status could not be rendered."),
  // Legacy backwards compatibility
  rechartVisualize: withSafeBoundary(LegacyRechartAdapter, "Chart could not be rendered."),
  // Future block stubs (fail gracefully until components are built)
  twinViewer: withSafeBoundary(TwinViewer, "Digital Twin could not be rendered."),
  optiPanel: withSafeBoundary(OptiPanel, "Optimization panel could not be rendered."),
  simResult: withSafeBoundary(SimResult, "Simulation result could not be rendered."),
  sankeyFlow: withSafeBoundary(SankeyEnergyFlow, "Sankey flow could not be rendered."),
  processDiagram: withSafeBoundary(ProcessDiagram, "Process diagram could not be rendered."),
  predictiveAlert: withSafeBoundary(PredictiveAlert, "Predictive alert could not be rendered."),
  radarDashboard: withSafeBoundary(ChartBlockAdapter, "Radar dashboard could not be rendered."),
  // Future block stubs
  energyFlow: withSafeBoundary(() => null),
  timeline: withSafeBoundary(() => null),
  anomalyMap: withSafeBoundary(() => null),
  predictiveForecast: withSafeBoundary(() => null),
  heatmap: withSafeBoundary(() => null),
  equipmentTree: withSafeBoundary(() => null),
  operationalRisk: withSafeBoundary(() => null),
  rootCause: withSafeBoundary(() => null),
};

/**
 * AIBlockRenderer
 * ================
 * Main entry point. Renders a list of AI blocks in priority order.
 * Validates blocks before rendering, drops invalid ones gracefully.
 *
 * @param {{ blocks: object[] }} props
 */
function AIBlockRenderer({ blocks = [] }) {
  if (!blocks || blocks.length === 0) return null;

  const validBlocks = validateAndFilterBlocks(blocks);
  const sortedBlocks = sortBlocksByPriority(validBlocks);

  return (
    <div className="flex flex-col gap-1 w-full ai-blocks-container">
      {sortedBlocks.map((block, index) => {
        const Renderer = BLOCK_RENDERERS[block.type];
        if (!Renderer) return null;
        return <Renderer key={`${block.type}-${index}`} block={block} />;
      })}
    </div>
  );
}

export default memo(AIBlockRenderer);
export { BLOCK_RENDERERS };
