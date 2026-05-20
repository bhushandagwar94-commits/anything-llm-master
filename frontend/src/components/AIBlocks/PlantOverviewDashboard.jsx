import React from 'react';
import { motion } from 'framer-motion';
import { Factory, AlertTriangle, CheckCircle2, TrendingUp, DollarSign, Info } from 'lucide-react';

export default function PlantOverviewDashboard({ block }) {
  const { payload } = block;
  const { plantName, overallEfficiency, status, anomalies = [], savings } = payload;

  const statusMap = {
    critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle, label: 'CRITICAL ACTION REQUIRED' },
    warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle, label: 'ATTENTION REQUIRED' },
    good: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, label: 'OPTIMAL OPERATION' },
  };

  const currentStatus = statusMap[status] || statusMap.good;

  return (
    <div className="w-full my-8 group animate-in fade-in zoom-in-95 duration-700">
      <div className="relative p-8 rounded-[3rem] bg-slate-900/40 backdrop-blur-3xl border border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
              <Factory className="text-blue-400 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-2">{plantName || "Industrial Plant"}</h3>
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${currentStatus.bg} ${currentStatus.border} ${currentStatus.color}`}>
                <currentStatus.icon size={12} strokeWidth={3} />
                {currentStatus.label}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="text-right px-6 py-2 border-r border-white/5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Efficiency Index</p>
                <p className="text-3xl font-black text-white">{overallEfficiency}%</p>
             </div>
             {savings && (
               <div className="text-right px-6 py-2">
                  <p className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-[0.2em] mb-1">Monthly Savings</p>
                  <p className="text-3xl font-black text-emerald-400 flex items-center justify-end">
                    <DollarSign size={24} strokeWidth={3} />
                    {savings.monthly}
                  </p>
               </div>
             )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Intelligence Feed (Anomalies) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-blue-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Active Intelligence Feed</h4>
              </div>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{anomalies.length} Critical Events</span>
            </div>

            <div className="space-y-3">
              {anomalies.map((a, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-4 p-5 rounded-3xl border transition-all duration-300 hover:scale-[1.01] ${
                    a.severity === 'high' ? 'bg-red-500/5 border-red-500/10' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 shadow-[0_0_10px] ${
                    a.severity === 'high' ? 'bg-red-400 shadow-red-500/50' : 'bg-amber-400 shadow-amber-500/50'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/80 leading-relaxed mb-2">{a.description}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                         a.severity === 'high' ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400'
                      }`}>
                        {a.severity} Priority
                      </span>
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Detected 14m ago</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {anomalies.length === 0 && (
                <div className="p-12 rounded-3xl border border-white/5 bg-white/2 flex flex-col items-center text-center">
                  <CheckCircle2 size={40} className="text-emerald-500/20 mb-4" />
                  <p className="text-sm font-medium text-white/40">All systems operational. No anomalies detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 relative overflow-hidden group/card">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform">
                <TrendingUp size={48} className="text-emerald-400" />
              </div>
              <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Savings Insight</h5>
              <p className="text-sm text-white/70 leading-relaxed italic mb-4">
                "Operational optimizations have yielded a <span className="text-emerald-400 font-bold">{savings?.percent || 0}%</span> reduction in specific energy consumption this month."
              </p>
              <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                Download Audit Report
              </button>
            </div>

            <div className="p-6 rounded-[2rem] bg-slate-900/60 border border-white/5">
              <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">System Reliability</h5>
              <div className="space-y-4">
                {[
                  { label: 'Uptime', val: '99.98%' },
                  { label: 'MTBF', val: '1,420 hrs' },
                  { label: 'Asset Health', val: '94/100' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-white/40 font-medium">{s.label}</span>
                    <span className="text-xs text-white font-bold">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
