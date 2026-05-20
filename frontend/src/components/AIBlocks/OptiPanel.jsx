import React from "react";
import { Cpu, Zap, ShieldAlert, Target, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

/**
 * OptiPanel
 * =========
 * Autonomous optimization strategies and setpoint recommendations.
 */
const OptiPanel = ({ payload }) => {
  const { title = "Autonomous Optimization", strategies = [] } = payload;

  return (
    <div className="seetech-block-container animate-fade-in border-emerald-500/20">
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
          <Cpu size={16} />
        </div>
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {strategies.map((strat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-2">
                  <Target size={14} /> {strat.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {strat.action}
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Confidence</div>
                <div className="text-sm font-mono text-emerald-400">{(strat.confidence * 100).toFixed(0)}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 text-[9px] text-emerald-500/70 uppercase tracking-wider mb-1">
                  <TrendingDown size={10} /> Savings
                </div>
                <div className="text-emerald-300 font-bold text-xs">{strat.estimated_savings}</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center gap-2 text-[9px] text-amber-500/70 uppercase tracking-wider mb-1">
                  <ShieldAlert size={10} /> Risk Level
                </div>
                <div className="text-amber-200 font-bold text-xs">{strat.risk}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SYSTEM ARMED
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> FEEDBACK LOOP: ACTIVE
        </div>
      </div>
    </div>
  );
};

export default OptiPanel;
