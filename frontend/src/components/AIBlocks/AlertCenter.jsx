import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertOctagon, Bell, Clock, ChevronRight } from 'lucide-react';

export default function AlertCenter({ block }) {
  const { payload } = block;
  const { alerts = [], summary = "System monitoring active." } = payload;

  const severityMap = {
    critical: { icon: AlertOctagon, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    high: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    medium: { icon: Bell, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  };

  return (
    <div className="w-full my-6 animate-in fade-in slide-in-from-left-8 duration-500">
      <div className="relative p-6 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertOctagon className="text-red-400 w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">Industrial Alert Center</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Operational Risk Assessment</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            {alerts.length} Active Alarms
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          <AnimatePresence>
            {alerts.map((alert, i) => {
              const style = severityMap[alert.severity] || severityMap.medium;
              const Icon = style.icon;

              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`group flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300 hover:scale-[1.01] ${style.bg} ${style.border}`}
                >
                  <div className={`p-2 rounded-xl bg-black/20 ${style.color}`}>
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1">{alert.title}</p>
                    <p className="text-xs text-white/60 leading-relaxed">{alert.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${style.color}`}>
                      {alert.severity}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                       <Clock size={10} /> {alert.time || "Just now"}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {alerts.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-white/30 italic">"{summary}"</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
           <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
             AI-Generated maintenance priority ranking active
           </div>
           <button className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-white transition-all">
             Acknowledge All Alarms <ChevronRight size={14} />
           </button>
        </div>
      </div>
    </div>
  );
}
