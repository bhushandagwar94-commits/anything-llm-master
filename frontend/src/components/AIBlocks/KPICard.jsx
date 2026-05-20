import React, { useState } from "react";
import { TrendUp, TrendDown, Minus, ChartBar } from "@phosphor-icons/react";

/**
 * KPICard — Premium Industrial KPI Visualization Block
 * =====================================================
 * Renders a glassmorphic KPI card with animated metric indicators,
 * severity-based color coding, and hover states.
 *
 * Expected block schema:
 * {
 *   "type": "kpiCard",
 *   "version": "1.0",
 *   "priority": "warning",
 *   "title": "COP Performance",
 *   "payload": {
 *     "metrics": [
 *       { "label": "Current COP", "value": "3.1", "unit": "", "trend": "down", "status": "critical" },
 *       { "label": "Target COP",  "value": "5.0", "unit": "", "trend": "up",   "status": "good" },
 *       { "label": "Efficiency Gap", "value": "-38%", "status": "critical" }
 *     ],
 *     "recommendation": "Check condenser water temperature settings."
 *   }
 * }
 */

const STATUS_STYLES = {
  critical: {
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.3)",
    text: "#ef4444",
    badge: "rgba(239, 68, 68, 0.15)",
  },
  warning: {
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#f59e0b",
    badge: "rgba(245, 158, 11, 0.15)",
  },
  good: {
    bg: "rgba(34, 197, 94, 0.08)",
    border: "rgba(34, 197, 94, 0.3)",
    text: "#22c55e",
    badge: "rgba(34, 197, 94, 0.15)",
  },
  optimization: {
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.3)",
    text: "#3b82f6",
    badge: "rgba(59, 130, 246, 0.15)",
  },
  info: {
    bg: "rgba(148, 163, 184, 0.06)",
    border: "rgba(148, 163, 184, 0.2)",
    text: "#94a3b8",
    badge: "rgba(148, 163, 184, 0.1)",
  },
};

const PRIORITY_HEADER = {
  critical: { label: "CRITICAL", color: "#ef4444" },
  warning: { label: "WARNING", color: "#f59e0b" },
  optimization: { label: "OPTIMIZATION", color: "#3b82f6" },
  info: { label: "INFO", color: "#94a3b8" },
  good: { label: "OPERATIONAL", color: "#22c55e" },
};

function TrendIcon({ trend, status }) {
  const color = STATUS_STYLES[status]?.text || "#94a3b8";
  if (trend === "up") return <TrendUp size={14} color={color} weight="bold" />;
  if (trend === "down") return <TrendDown size={14} color={color} weight="bold" />;
  return <Minus size={14} color={color} weight="bold" />;
}

function MetricItem({ metric }) {
  const style = STATUS_STYLES[metric.status] || STATUS_STYLES.info;
  return (
    <div
      className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
      }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "rgba(148, 163, 184, 0.8)" }}
      >
        {metric.label}
      </span>
      <div className="flex items-center gap-2">
        {metric.trend && (
          <TrendIcon trend={metric.trend} status={metric.status || "info"} />
        )}
        <span className="text-sm font-black" style={{ color: style.text }}>
          {metric.value}
          {metric.unit && (
            <span className="text-xs font-medium ml-1 opacity-70">
              {metric.unit}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default function KPICard({ block }) {
  const [hovered, setHovered] = useState(false);
  const { title, payload, priority = "info" } = block;
  const { metrics = [], recommendation } = payload;
  const headerStyle = PRIORITY_HEADER[priority] || PRIORITY_HEADER.info;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 my-3"
      style={{
        background: hovered
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.08)"}`,
        backdropFilter: "blur(12px)",
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1)"
          : "0 4px 16px rgba(0,0,0,0.25)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{
              background: `${headerStyle.color}20`,
              border: `1px solid ${headerStyle.color}40`,
            }}
          >
            <ChartBar size={13} color={headerStyle.color} weight="bold" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.15em] text-white">
            {title || "KPI Analysis"}
          </span>
        </div>
        <span
          className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{
            color: headerStyle.color,
            background: `${headerStyle.color}18`,
            border: `1px solid ${headerStyle.color}30`,
          }}
        >
          {headerStyle.label}
        </span>
      </div>

      {/* Metrics */}
      <div className="p-3 flex flex-col gap-2">
        {metrics.map((metric, i) => (
          <MetricItem key={i} metric={metric} />
        ))}
      </div>

      {/* Recommendation Footer */}
      {recommendation && (
        <div
          className="px-4 py-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(148,163,184,0.7)" }}
          >
            <span className="font-bold text-blue-400">→ </span>
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
