import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Zap, Activity, Box, ArrowRight } from 'lucide-react';

const NODE_ICONS = {
  equipment: Box,
  pump: Droplets,
  fan: Wind,
  electrical: Zap,
  default: Activity
};

export default function SystemFlowDiagram({ block }) {
  const { payload } = block;
  const { title, nodes = [], flows = [] } = payload;

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  // Simplified SVG layout logic
  // Assume nodes have x, y coordinates (0-100 scale converted to SVG viewbox)
  const viewboxWidth = 400;
  const viewboxHeight = 250;

  return (
    <div className="w-full my-8 group animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative p-8 rounded-[3rem] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <Box className="text-blue-400 w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">{title || "System Topology"}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Digital Twin Architecture</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Sync</span>
             </div>
          </div>
        </div>

        {/* SVG Diagram Area */}
        <div className="relative aspect-[4/2.5] w-full bg-black/20 rounded-[2rem] border border-white/5 p-4 overflow-visible">
          <svg 
            viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`} 
            className="w-full h-full overflow-visible"
          >
            {/* Define Gradients & Markers */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orientation="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.2)" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Flows (Connectors) */}
            {flows.map((f, i) => {
              const fromNode = nodes.find(n => n.id === f.from);
              const toNode = nodes.find(n => n.id === f.to);
              if (!fromNode || !toNode) return null;

              const x1 = (fromNode.x / 100) * viewboxWidth;
              const y1 = (fromNode.y / 100) * viewboxHeight;
              const x2 = (toNode.x / 100) * viewboxWidth;
              const y2 = (toNode.y / 100) * viewboxHeight;

              // Quadratic curve control point
              const cx = (x1 + x2) / 2;
              const cy = (y1 + y2) / 2 - 20;

              return (
                <g key={`flow-${i}`}>
                  {/* Background Path */}
                  <path 
                    d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="3"
                    fill="none"
                  />
                  {/* Active Animated Flow */}
                  {f.active && (
                    <motion.path 
                      d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                      stroke={f.color === 'cyan' ? '#22d3ee' : '#3b82f6'}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="10, 20"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ filter: 'url(#glow)' }}
                    />
                  )}
                </g>
              );
            })}

            {/* Nodes (Equipment) */}
            {nodes.map((n, i) => {
              const x = (n.x / 100) * viewboxWidth;
              const y = (n.y / 100) * viewboxHeight;
              const Icon = NODE_ICONS[n.type] || NODE_ICONS.default;

              return (
                <motion.g 
                  key={`node-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="cursor-pointer group/node"
                >
                  {/* Node Background Glow */}
                  <circle cx={x} cy={y} r="25" fill={getStatusColor(n.status)} opacity="0.05" className="group-hover/node:opacity-10 transition-opacity" />
                  
                  {/* Node Circle */}
                  <circle 
                    cx={x} cy={y} r="18" 
                    fill="#1e293b" 
                    stroke={getStatusColor(n.status)} 
                    strokeWidth="1.5" 
                    className="shadow-xl"
                  />
                  
                  {/* Icon */}
                  <foreignObject x={x - 8} y={y - 8} width="16" height="16">
                    <Icon size={16} className="text-white/60 group-hover/node:text-white transition-colors" />
                  </foreignObject>

                  {/* Label */}
                  <text 
                    x={x} y={y + 32} 
                    textAnchor="middle" 
                    className="text-[8px] font-black uppercase tracking-widest fill-white/40 pointer-events-none group-hover/node:fill-white transition-colors"
                  >
                    {n.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Legend / Info Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
           <div className="flex gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-sm bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Flow</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-sm bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Return Loop</span>
              </div>
           </div>
           <button className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-all">
              Detailed Topology View <ArrowRight size={14} />
           </button>
        </div>
      </div>
    </div>
  );
}
