import React, { useState } from "react";
import { Table, CaretDown, CaretUp } from "@phosphor-icons/react";

/**
 * EngineeringTable — Structured Engineering Data Table Block
 * ==========================================================
 * Schema:
 * {
 *   "type": "engineeringTable",
 *   "version": "1.0",
 *   "priority": "info",
 *   "title": "Chiller Performance Data",
 *   "payload": {
 *     "headers": ["Parameter", "Value", "Unit", "Status"],
 *     "rows": [
 *       ["COP", "3.1", "", "Critical"],
 *       ["kW/ton", "1.13", "kW/ton", "Warning"],
 *       ["Condenser Temp", "34", "°C", "Normal"]
 *     ]
 *   }
 * }
 */

const CELL_STATUS_COLOR = {
  Critical: "#ef4444",
  Warning: "#f59e0b",
  Normal: "#22c55e",
  Good: "#22c55e",
  Info: "#3b82f6",
};

export default function EngineeringTable({ block }) {
  const [collapsed, setCollapsed] = useState(false);
  const { title, payload } = block;
  const { headers = [], rows = [] } = payload;

  return (
    <div
      className="rounded-2xl overflow-hidden my-3"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <button
        className="w-full px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: collapsed ? "none" : "1px solid rgba(255,255,255,0.06)" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2.5">
          <Table size={14} color="#3b82f6" weight="bold" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            {title || "Engineering Data"}
          </span>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ color: "#3b82f6", background: "rgba(59,130,246,0.12)" }}
          >
            {rows.length} rows
          </span>
        </div>
        {collapsed ? (
          <CaretDown size={14} color="rgba(148,163,184,0.5)" />
        ) : (
          <CaretUp size={14} color="rgba(148,163,184,0.5)" />
        )}
      </button>

      {!collapsed && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] whitespace-nowrap"
                    style={{ color: "rgba(59,130,246,0.8)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="transition-colors"
                  style={{
                    borderBottom: ri < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {row.map((cell, ci) => {
                    const statusColor = CELL_STATUS_COLOR[cell];
                    return (
                      <td
                        key={ci}
                        className="px-4 py-2.5 text-xs whitespace-nowrap"
                        style={{
                          color: statusColor
                            ? statusColor
                            : ci === 0
                            ? "rgba(226,232,240,0.9)"
                            : "rgba(148,163,184,0.8)",
                          fontWeight: ci === 0 ? 600 : statusColor ? 700 : 400,
                        }}
                      >
                        {statusColor ? (
                          <span
                            className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                            style={{
                              background: `${statusColor}15`,
                              border: `1px solid ${statusColor}30`,
                            }}
                          >
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
