import React, { useState } from "react";
import { Lightbulb, CaretDown, CaretUp } from "@phosphor-icons/react";

/**
 * InsightCard — Engineering Intelligence Insight Block
 * =====================================================
 * Renders a collapsible engineering insight with expandable detail section.
 *
 * Schema:
 * {
 *   "type": "insight",
 *   "version": "1.0",
 *   "priority": "optimization",
 *   "title": "Partial Load Inefficiency Detected",
 *   "payload": {
 *     "message": "The chiller is operating at 45% load...",
 *     "details": "At partial load conditions, the compressor...",
 *     "impact": "Estimated 12% energy waste",
 *     "tags": ["HVAC", "Chiller", "Efficiency"]
 *   }
 * }
 */

const INSIGHT_STYLES = {
  optimization: {
    icon: "#3b82f6",
    bg: "rgba(59,130,246,0.06)",
    border: "rgba(59,130,246,0.2)",
    badge: "#3b82f6",
  },
  info: {
    icon: "#94a3b8",
    bg: "rgba(148,163,184,0.05)",
    border: "rgba(148,163,184,0.15)",
    badge: "#94a3b8",
  },
  warning: {
    icon: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.2)",
    badge: "#f59e0b",
  },
  critical: {
    icon: "#ef4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.2)",
    badge: "#ef4444",
  },
};

export default function InsightCard({ block }) {
  const [expanded, setExpanded] = useState(false);
  const { title, payload, priority = "info" } = block;
  const { message, details, impact, tags = [] } = payload;
  const style = INSIGHT_STYLES[priority] || INSIGHT_STYLES.info;
  const hasDetails = !!details;

  return (
    <div
      className="rounded-xl overflow-hidden my-2 transition-all duration-200"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0"
              style={{ background: `${style.icon}20` }}
            >
              <Lightbulb size={12} color={style.icon} weight="fill" />
            </div>
            <div className="flex-1">
              {title && (
                <p
                  className="text-xs font-black uppercase tracking-wider mb-1"
                  style={{ color: style.icon }}
                >
                  {title}
                </p>
              )}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(226,232,240,0.9)" }}
              >
                {message}
              </p>
              {impact && (
                <p
                  className="text-xs mt-1.5 font-semibold"
                  style={{ color: style.icon }}
                >
                  ⚡ {impact}
                </p>
              )}
            </div>
          </div>
          {hasDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0 p-1 rounded-lg transition-colors"
              style={{ color: "rgba(148,163,184,0.6)" }}
            >
              {expanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
            </button>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5 ml-7">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  color: style.badge,
                  background: `${style.badge}15`,
                  border: `1px solid ${style.badge}30`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expandable detail section */}
      {hasDetails && expanded && (
        <div
          className="px-4 py-3"
          style={{ borderTop: `1px solid ${style.border}` }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(148,163,184,0.8)" }}
          >
            {details}
          </p>
        </div>
      )}
    </div>
  );
}
