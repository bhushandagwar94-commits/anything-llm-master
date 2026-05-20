import React from "react";
import { PlayCircle, TrendingUp, BarChart3, Info } from "lucide-react";

/**
 * SimResult
 * =========
 * Visualizes the outcome of an engineering simulation (Scenario A vs Scenario B).
 */
const SimResult = ({ payload }) => {
  const { title = "Engineering Simulation Result", scenarios = [], projections = {} } = payload;

  return (
    <div className="seetech-block-container animate-fade-in border-blue-500/20">
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
          <PlayCircle size={16} />
        </div>
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {scenarios.map((scene, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-2 py-1 text-[8px] font-black tracking-widest uppercase ${idx === 0 ? 'bg-slate-700 text-slate-300' : 'bg-blue-600 text-white'}`}>
              {idx === 0 ? 'Current State' : 'Simulated State'}
            </div>
            
            <div className="text-[10px] text-slate-500 uppercase mb-3">{scene.name}</div>
            
            <div className="space-y-3">
              {scene.metrics.map((m, midx) => (
                <div key={midx} className="flex items-end justify-between">
                  <span className="text-[10px] text-slate-400">{m.label}</span>
                  <span className={`text-sm font-mono ${idx === 1 ? 'text-blue-400' : 'text-white'}`}>
                    {m.value} <span className="text-[10px] opacity-60 font-sans">{m.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 relative">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={14} className="text-blue-400" />
          <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">Projected Impact</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">Efficiency Gain</div>
            <div className="text-2xl font-mono text-emerald-400">
              +{projections.efficiencyGain}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">ROI Confidence</div>
            <div className="text-2xl font-mono text-blue-400">
              {projections.confidence * 100}%
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-2">
          <Info size={12} className="text-slate-500 mt-0.5" />
          <p className="text-[10px] text-slate-400 italic leading-tight">
            Simulation based on 12-month rolling load profile and ASHRAE 90.1 thermal standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimResult;
