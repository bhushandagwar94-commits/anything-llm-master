import React from "react";
import ReactECharts from "echarts-for-react";
import { Activity } from "lucide-react";

/**
 * ProcessDiagram
 * ==============
 * Force-directed graph representing industrial process loops.
 */
const ProcessDiagram = ({ payload }) => {
  const { title = "Process Flow Topology", nodes = [], edges = [] } = payload;

  const option = {
    title: {
      text: title,
      textStyle: { color: "#fff", fontSize: 14, fontWeight: "normal" },
      top: 10,
      left: 10,
    },
    tooltip: {},
    series: [
      {
        type: "graph",
        layout: "force",
        symbolSize: 40,
        roam: true,
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 8],
        force: {
          repulsion: 500,
          edgeLength: [100, 200],
        },
        draggable: true,
        itemStyle: {
          color: "#0ea5e9",
          borderColor: "rgba(14, 165, 233, 0.3)",
          borderWidth: 8,
        },
        lineStyle: {
          color: "rgba(14, 165, 233, 0.4)",
          width: 2,
          curveness: 0.1,
        },
        label: {
          show: true,
          position: "bottom",
          color: "#fff",
          fontSize: 10,
        },
        data: nodes,
        links: edges,
      },
    ],
    backgroundColor: "transparent",
  };

  return (
    <div className="seetech-block-container animate-fade-in">
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
          <Activity size={16} />
        </div>
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
          {title}
        </h3>
      </div>
      <div className="h-[400px] w-full bg-slate-900/40 rounded-xl overflow-hidden border border-white/5">
        <ReactECharts 
          option={option} 
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <div className="mt-2 text-[10px] text-slate-500 italic text-center">
        Force-Directed Operational Topology (Interactive)
      </div>
    </div>
  );
};

export default ProcessDiagram;
