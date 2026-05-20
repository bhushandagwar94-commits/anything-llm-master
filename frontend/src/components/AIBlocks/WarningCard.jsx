import React from "react";
import { WarningDiamond, ShieldWarning } from "@phosphor-icons/react";

/**
 * WarningCard — Operational Warning & Critical Alert Block
 * =========================================================
 * Schema:
 * {
 *   "type": "warning",
 *   "version": "1.0",
 *   "priority": "critical",
 *   "title": "High Condenser Temperature",
 *   "payload": {
 *     "message": "Condenser water temperature exceeds 32°C threshold...",
 *     "action": "Inspect cooling tower fill media and water treatment.",
 *     "affectedSystems": ["Chiller-01", "Cooling Tower-A"]
 *   }
 * }
 */

const WARNING_STYLES = {
  critical: {
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.35)",
    accent: "#ef4444",
    icon: ShieldWarning,
    label: "CRITICAL ALERT",
  },
  warning: {
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.35)",
    accent: "#f59e0b",
    icon: WarningDiamond,
    label: "OPERATIONAL WARNING",
  },
};

export default function WarningCard({ block }) {
  const { title, payload, priority = "warning" } = block;
  const { message, action, affectedSystems = [] } = payload;
  const style = WARNING_STYLES[priority] || WARNING_STYLES.warning;
  const Icon = style.icon;

  return (
    <div
      className="rounded-xl overflow-hidden my-2"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header stripe */}
      <div
        className="px-4 py-2 flex items-center gap-2"
        style={{
          background: `${style.accent}12`,
          borderBottom: `1px solid ${style.border}`,
        }}
      >
        <Icon size={14} color={style.accent} weight="fill" />
        <span
          className="text-[9px] font-black uppercase tracking-[0.2em]"
          style={{ color: style.accent }}
        >
          {style.label}
        </span>
        {title && (
          <span
            className="text-[9px] font-black uppercase tracking-widest ml-auto opacity-70"
            style={{ color: style.accent }}
          >
            {title}
          </span>
        )}
      </div>

      <div className="px-4 py-3">
        <p className="text-sm leading-relaxed" style={{ color: "rgba(226,232,240,0.9)" }}>
          {message}
        </p>

        {action && (
          <div
            className="mt-2.5 px-3 py-2 rounded-lg"
            style={{
              background: `${style.accent}10`,
              border: `1px solid ${style.accent}25`,
            }}
          >
            <p className="text-xs font-semibold" style={{ color: style.accent }}>
              Recommended Action
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.85)" }}>
              {action}
            </p>
          </div>
        )}

        {affectedSystems.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {affectedSystems.map((sys, i) => (
              <span
                key={i}
                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{
                  color: style.accent,
                  background: `${style.accent}15`,
                  border: `1px solid ${style.accent}30`,
                }}
              >
                {sys}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
