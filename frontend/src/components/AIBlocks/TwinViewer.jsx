import React from "react";
import ReactECharts from "echarts-for-react";
import { Boxes, Share2 } from "lucide-react";

/**
 * TwinViewer
 * ==========
 * Interactive Digital Twin topology viewer.
 */
const TwinViewer = ({ payload }) => {
  const { title = "Digital Twin Topology", nodes = [], links = [] } = payload;

  const option = {
    title: {
      text: title,
      textStyle: { color: "#fff", fontSize: 14, fontWeight: "normal" },
      top: 10,
      left: 10,
    },
    tooltip: {
      formatter: (params) => {
        if (params.dataType === "node") {
          return `${params.data.name}<br/>Health: ${(params.data.health * 100).toFixed(1)}%`;
        }
        return `${params.data.source} -> ${params.data.target}`;
      }
    },
    series: [
      {
        type: "graph",
        layout: "force",
        symbolSize: 45,
        roam: true,
        label: {
          show: true,
          position: "bottom",
          color: "#fff",
          fontSize: 10,
        },
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 8],
        force: {
          repulsion: 800,
          edgeLength: 150,
        },
        itemStyle: {
          color: (params) => {
            const health = params.data.health ?? 1;
            if (health > 0.9) return "#22d3ee";
            if (health > 0.7) return "#f59e0b";
            return "#ef4444";
          },
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.2)",
        },
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)",
          width: 2,
          curveness: 0.1,
        },
        data: nodes,
        links: links,
      },
    ],
    backgroundColor: "transparent",
  };

  return (
    <div className="seetech-block-container animate-fade-in border-cyan-500/20">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Boxes size={16} />
          </div>
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-cyan-400/60 font-mono">
          <Share2 size={12} /> SYNCED
        </div>
      </div>
      
      <div className="h-[400px] w-full bg-slate-950/40 rounded-xl overflow-hidden border border-white/5 relative">
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[9px] text-slate-500">
            <div className="w-2 h-2 rounded-full bg-cyan-400" /> Optimal
          </div>
          <div className="flex items-center gap-2 text-[9px] text-slate-500">
            <div className="w-2 h-2 rounded-full bg-amber-400" /> At Risk
          </div>
        </div>
        <ReactECharts 
          option={option} 
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
          <div className="text-[9px] text-slate-500 uppercase mb-1">Fidelity</div>
          <div className="text-xs font-mono text-cyan-400">HIGH</div>
        </div>
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
          <div className="text-[9px] text-slate-500 uppercase mb-1">State Sync</div>
          <div className="text-xs font-mono text-cyan-400">REAL-TIME</div>
        </div>
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
          <div className="text-[9px] text-slate-500 uppercase mb-1">Model Drift</div>
          <div className="text-xs font-mono text-emerald-400">0.2%</div>
        </div>
      </div>
    </div>
  );
};

export default TwinViewer;
