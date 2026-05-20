import React from "react";
import ReactECharts from "echarts-for-react";
import { Zap } from "lucide-react";

/**
 * SankeyEnergyFlow
 * ================
 * Visualizes energy distribution across plant systems (e.g., Grid -> Chiller -> AHU).
 */
const SankeyEnergyFlow = ({ payload }) => {
  const { title = "Energy Flow Analysis", nodes = [], links = [] } = payload;

  const option = {
    title: {
      text: title,
      textStyle: { color: "#fff", fontSize: 14, fontWeight: "normal" },
      top: 10,
      left: 10,
    },
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      formatter: "{b}: {c} kW",
    },
    series: [
      {
        type: "sankey",
        data: nodes,
        links: links,
        emphasis: { focus: "adjacency" },
        lineStyle: {
          color: "gradient",
          curveness: 0.5,
          opacity: 0.3,
        },
        label: {
          color: "#fff",
          fontSize: 10,
        },
        itemStyle: {
          borderWidth: 0,
          borderRadius: 4,
        },
      },
    ],
    backgroundColor: "transparent",
  };

  return (
    <div className="seetech-block-container animate-fade-in">
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
          <Zap size={16} />
        </div>
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
          {title}
        </h3>
      </div>
      <div className="h-[300px] w-full">
        <ReactECharts 
          option={option} 
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
      <div className="mt-2 text-[10px] text-slate-500 italic text-center">
        Interactive Sankey Energy Distribution Model (Live)
      </div>
    </div>
  );
};

export default SankeyEnergyFlow;
