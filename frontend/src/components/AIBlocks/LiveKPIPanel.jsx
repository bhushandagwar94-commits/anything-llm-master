import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Zap, TrendingDown, Target, Gauge } from 'lucide-react';

const AnimatedCounter = ({ value, unit = "", decimals = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = parseFloat(value);
    const duration = 1000;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = start + (end - start) * ease;
      
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [value]);

  return (
    <span className="tabular-nums">
      {displayValue.toFixed(decimals)}
      {unit && <span className="text-xs ml-0.5 opacity-50 font-medium">{unit}</span>}
    </span>
  );
};

export default function LiveKPIPanel({ block }) {
  const { payload } = block;
  const { title, healthScore, metrics = [], baseline } = payload;

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-amber-400';
      case 'good': return 'text-emerald-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      case 'good': return 'bg-emerald-500/10 border-emerald-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="w-full my-6 group animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative p-6 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <Activity className="text-blue-400 w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">{title || "Equipment Health"}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Real-Time Intelligence Feed</p>
            </div>
          </div>
          
          {/* Health Gauge */}
          <div className="relative flex flex-col items-end">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Health Score</p>
                <div className="text-2xl font-black text-white">
                  <AnimatedCounter value={healthScore} decimals={0} unit="%" />
                </div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                  <motion.circle 
                    cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                    className={healthScore > 80 ? "text-emerald-400" : healthScore > 50 ? "text-amber-400" : "text-red-400"}
                    strokeDasharray={175.9}
                    initial={{ strokeDashoffset: 175.9 }}
                    animate={{ strokeDashoffset: 175.9 - (175.9 * healthScore) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className={healthScore > 80 ? "text-emerald-400 w-5 h-5" : "text-white/20 w-5 h-5"} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {metrics.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-3xl border ${getStatusBg(m.status)} transition-all hover:bg-white/5 group/metric`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-1.5 rounded-lg bg-white/5">
                  <Gauge className="w-3.5 h-3.5 text-white/40 group-hover/metric:text-white transition-colors" />
                </div>
                {m.target && (
                  <div className="flex items-center gap-1 text-[9px] font-bold text-white/20 uppercase">
                    <Target size={8} /> {m.target}
                  </div>
                )}
              </div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{m.label}</p>
              <div className={`text-xl font-black ${getStatusColor(m.status)}`}>
                <AnimatedCounter value={m.value} unit={m.unit} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Energy Baseline Comparison */}
        {baseline && (
          <div className="mt-6 pt-6 border-t border-white/5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="text-amber-400 w-4 h-4" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Energy vs Baseline</span>
              </div>
              <div className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                {((baseline.current / baseline.expected - 1) * 100).toFixed(1)}% OVER
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((baseline.current / baseline.expected) * 50, 100)}%` }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                />
                {/* Marker for expected */}
                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/40 z-20" />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                <div className="text-white/40">Current: <span className="text-white ml-1">{baseline.current} {baseline.unit}</span></div>
                <div className="text-white/20">Baseline Target: <span className="text-white/60 ml-1">{baseline.expected} {baseline.unit}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
