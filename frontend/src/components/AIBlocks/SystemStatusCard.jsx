import React from "react";
import { Cpu, CheckCircle, Warning, XCircle } from "@phosphor-icons/react";

/**
 * SystemStatusCard — Industrial System Status Dashboard Block
 * ===========================================================
 * Schema:
 * {
 *   "type": "systemStatus",
 *   "version": "1.0",
 *   "priority": "warning",
 *   "title": "Plant Equipment Status",
 *   "payload": {
 *     "systems": [
 *       { "name": "Chiller-01",       "status": "critical", "detail": "High condenser temp" },
 *       { "name": "Cooling Tower-A",  "status": "warning",  "detail": "Low flow rate" },
 *       { "name": "Pump-02",          "status": "good",     "detail": "Operating normally" },
 *       { "name": "AHU-03",           "status": "good",     "detail": "Within range" }
 *     ]
 *   }
 * }
 */

const STATUS_CONFIG = {
  critical: { color: "#ef4444", Icon: XCircle, label: "CRITICAL" },
  warning: { color: "#f59e0b", Icon: Warning, label: "WARNING" },
  good: { color: "#22c55e", Icon: CheckCircle, label: "NORMAL" },
  offline: { color: "#6b7280", Icon: XCircle, label: "OFFLINE" },
};

function StatusRow({ system }) {
  const config = STATUS_CONFIG[system.status] || STATUS_CONFIG.good;
  const Icon = config.Icon;

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-xl"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <Icon size={15} color={config.color} weight="fill" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white truncate">{system.name}</p>
        {system.detail && (
          <p className="text-[10px] truncate" style={{ color: "rgba(148,163,184,0.65)" }}>
            {system.detail}
          </p>
        )}
      </div>
      <span
        className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full flex-shrink-0"
        style={{
          color: config.color,
          background: `${config.color}15`,
          border: `1px solid ${config.color}30`,
        }}
      >
        {config.label}
      </span>
    </div>
  );
}

export default function SystemStatusCard({ block }) {
  const { title, payload } = block;
  const { systems = [] } = payload;

  const criticalCount = systems.filter((s) => s.status === "critical").length;
  const warningCount = systems.filter((s) => s.status === "warning").length;

  return (
    <div
      className="rounded-2xl overflow-hidden my-3"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <Cpu size={15} color="#3b82f6" weight="bold" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            {title || "System Status"}
          </span>
        </div>
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
              style={{ color: "#ef4444", background: "rgba(239,68,68,0.15)" }}
            >
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
              style={{ color: "#f59e0b", background: "rgba(245,158,11,0.15)" }}
            >
              {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {systems.map((sys, i) => (
          <StatusRow key={i} system={sys} />
        ))}
      </div>
    </div>
  );
}
