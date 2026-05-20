import React, { useState } from "react";
import { ListChecks, CaretDown, CaretUp } from "@phosphor-icons/react";

/**
 * RecommendationCard — Prioritized Engineering Recommendation Block
 * =================================================================
 * Schema:
 * {
 *   "type": "recommendation",
 *   "version": "1.0",
 *   "priority": "optimization",
 *   "title": "Efficiency Improvements",
 *   "payload": {
 *     "items": [
 *       { "action": "Replace condenser water pump impeller", "impact": "High", "effort": "Medium", "savings": "$4,200/yr" },
 *       { "action": "Optimize chiller staging sequence", "impact": "Medium", "effort": "Low", "savings": "$2,800/yr" }
 *     ],
 *     "totalPotentialSavings": "$7,000/yr"
 *   }
 * }
 */

const IMPACT_COLOR = {
  High: "#22c55e",
  Medium: "#f59e0b",
  Low: "#94a3b8",
  Critical: "#ef4444",
};

const EFFORT_COLOR = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
};

export default function RecommendationCard({ block }) {
  const [collapsed, setCollapsed] = useState(false);
  const { title, payload } = block;
  const { items = [], totalPotentialSavings } = payload;

  return (
    <div
      className="rounded-2xl overflow-hidden my-3"
      style={{
        background: "rgba(59,130,246,0.05)",
        border: "1px solid rgba(59,130,246,0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <button
        className="w-full px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: collapsed ? "none" : "1px solid rgba(59,130,246,0.15)" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.15)" }}
          >
            <ListChecks size={13} color="#3b82f6" weight="bold" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-white">
            {title || "Recommendations"}
          </span>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ color: "#3b82f6", background: "rgba(59,130,246,0.15)" }}
          >
            {items.length} actions
          </span>
        </div>
        <div className="flex items-center gap-3">
          {totalPotentialSavings && (
            <span className="text-xs font-bold text-green-400">
              {totalPotentialSavings}
            </span>
          )}
          {collapsed ? (
            <CaretDown size={14} color="rgba(148,163,184,0.5)" />
          ) : (
            <CaretUp size={14} color="rgba(148,163,184,0.5)" />
          )}
        </div>
      </button>

      {!collapsed && (
        <div className="p-3 flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <span
                    className="text-[10px] font-black text-blue-400 mt-0.5 flex-shrink-0"
                    style={{ minWidth: 16 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm" style={{ color: "rgba(226,232,240,0.9)" }}>
                    {item.action}
                  </p>
                </div>
                {item.savings && (
                  <span className="text-xs font-bold text-green-400 flex-shrink-0">
                    {item.savings}
                  </span>
                )}
              </div>
              {(item.impact || item.effort) && (
                <div className="flex gap-2 mt-1.5 ml-6">
                  {item.impact && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        color: IMPACT_COLOR[item.impact] || "#94a3b8",
                        background: `${IMPACT_COLOR[item.impact] || "#94a3b8"}15`,
                      }}
                    >
                      {item.impact} Impact
                    </span>
                  )}
                  {item.effort && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        color: EFFORT_COLOR[item.effort] || "#94a3b8",
                        background: `${EFFORT_COLOR[item.effort] || "#94a3b8"}15`,
                      }}
                    >
                      {item.effort} Effort
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
