import React from "react";
import { BrainCircuit, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

/**
 * PredictiveAlert
 * ===============
 * High-visibility alert for predicted anomalies or drift.
 */
const PredictiveAlert = ({ payload }) => {
  const { 
    title = "PREDICTIVE ANOMALY DETECTED", 
    prediction = "Potential failure predicted in Condenser Pump #2.", 
    timeframe = "48-72 Hours",
    confidence = "85%",
    impact = "Critical efficiency loss (approx. 12kW increase)"
  } = payload;

  return (
    <div className="relative group seetech-block-container overflow-hidden border-amber-500/30 bg-amber-500/5 animate-pulse-slow">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <BrainCircuit size={80} className="text-amber-400" />
      </div>
      
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <AlertTriangle size={24} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black tracking-[0.2em] text-amber-500/60 uppercase">
              Predictive Intelligence Engine
            </span>
          </div>
          <h3 className="text-lg font-bold text-amber-400 mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {prediction}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                <Clock size={10} /> Timeframe
              </div>
              <div className="text-amber-200 font-mono text-xs">{timeframe}</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                <TrendingUp size={10} /> Confidence
              </div>
              <div className="text-emerald-400 font-mono text-xs">{confidence}</div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="text-red-400 text-[10px] font-bold uppercase mb-1">Predicted Impact</div>
            <div className="text-slate-300 text-xs">{impact}</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-amber-500 w-full opacity-30 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
    </div>
  );
};

export default PredictiveAlert;
