import React, { useRef, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Download, Maximize2, Info, TrendingUp } from 'lucide-react';
import { saveAs } from 'file-saver';
import { useThemeContext } from '@/ThemeContext';

export default function ChartBlock({ chart, kpis }) {
  const chartRef = useRef(null);
  const { type, title, xAxis, series, insight, unit = "" } = chart;
  const { theme, isLight } = useThemeContext();
  const isDark = theme === "dark" || !isLight;

  const chartBackground = isDark ? "#07111F" : "#FFFFFF";
  const cardBorder = isDark ? "rgba(0,229,255,0.15)" : "rgba(15,23,42,0.08)";
  const textColor = isDark ? "#E6F7FF" : "#0F172A";
  const secondaryText = isDark ? "#94A3B8" : "#475569";

  const chartColors = isDark
    ? ["#00E5FF", "#38BDF8", "#22C55E"]
    : ["#0284C7", "#2563EB", "#16A34A"];

  const option = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      textStyle: {
        color: textColor
      },
      title: {
        text: title,
        left: 'center',
        textStyle: {
          color: textColor,
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif'
        },
        top: 10
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
        borderColor: isDark ? "#00E5FF" : "#CBD5E1",
        borderWidth: 1,
        textStyle: { 
          color: isDark ? "#FFFFFF" : "#0F172A" 
        },
        axisPointer: {
          type: 'cross',
          label: { 
            backgroundColor: isDark ? '#1e293b' : '#334155' 
          }
        }
      },
      legend: {
        data: series.map(s => s.name),
        bottom: 10,
        textStyle: { 
          color: textColor 
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      toolbox: {
        show: false
      },
      xAxis: {
        type: 'category',
        data: xAxis,
        axisLine: { 
          lineStyle: { 
            color: isDark ? "#334155" : "#CBD5E1" 
          } 
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)"
          }
        },
        axisLabel: { 
          color: secondaryText 
        }
      },
      yAxis: {
        type: 'value',
        name: unit,
        nameTextStyle: { 
          color: secondaryText 
        },
        splitLine: { 
          lineStyle: { 
            color: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)" 
          } 
        },
        axisLine: { 
          show: true,
          lineStyle: {
            color: isDark ? "#334155" : "#CBD5E1"
          }
        },
        axisLabel: { 
          color: secondaryText 
        }
      },
      series: series.map((s, idx) => ({
        name: s.name,
        type: type === 'area' ? 'line' : type,
        data: s.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: type === 'area' ? {
          opacity: 0.3,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: isDark ? [
              { offset: 0, color: 'rgba(0, 229, 255, 0.5)' },
              { offset: 1, color: 'rgba(0, 229, 255, 0)' }
            ] : [
              { offset: 0, color: 'rgba(2, 132, 199, 0.5)' },
              { offset: 1, color: 'rgba(2, 132, 199, 0)' }
            ]
          }
        } : undefined,
        itemStyle: {
          color: chartColors[idx % chartColors.length]
        },
        lineStyle: {
          width: 3,
          shadowBlur: 10,
          shadowColor: isDark ? 'rgba(0, 229, 255, 0.5)' : 'rgba(2, 132, 199, 0.3)'
        }
      })),
      animationDuration: 2000
    };
  }, [chart, isDark, textColor, secondaryText, chartColors, unit, type, title, xAxis, series]);

  const handleDownload = () => {
    const instance = chartRef.current.getEchartsInstance();
    const dataUrl = instance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: isDark ? '#07111F' : '#FFFFFF'
    });
    saveAs(dataUrl, `${title.replace(/\s+/g, '_')}.png`);
  };

  return (
    <div className="w-full my-6 group animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div 
        className="relative shadow-2xl overflow-hidden"
        style={{
          background: chartBackground,
          border: `1px solid ${cardBorder}`,
          borderRadius: "18px",
          padding: "18px",
          width: "100%",
          minHeight: "420px",
          transition: "all 0.3s ease"
        }}
      >
        {/* Header Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleDownload}
            className={`p-2 rounded-full border transition-all ${
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white' 
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Export PNG"
          >
            <Download size={18} />
          </button>
          <button className={`p-2 rounded-full border transition-all ${
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white' 
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}>
            <Maximize2 size={18} />
          </button>
        </div>

        {/* KPIs Grid */}
        {kpis && Object.keys(kpis).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-8">
            {Object.entries(kpis).map(([key, val]) => (
              <div 
                key={key} 
                className="p-4 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center backdrop-blur-md transition-all duration-300"
                style={{
                  background: isDark ? "rgba(15,23,42,0.75)" : "#F8FAFC",
                  color: textColor,
                  border: isDark ? "1px solid rgba(0,229,255,0.12)" : "1px solid rgba(15,23,42,0.06)"
                }}
              >
                <div className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-cyan-400' : 'text-sky-600'}`}>
                  {val}
                </div>
                <div className="text-[11px] uppercase font-bold tracking-wider mt-1" style={{ color: secondaryText }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ECharts Instance */}
        <div className="h-[400px] w-full">
          <ReactECharts 
            ref={chartRef}
            option={option} 
            style={{ height: '100%', width: '100%' }}
            theme={isDark ? "dark" : "light"}
          />
        </div>

        {/* Footer Insight */}
        {insight && (
          <div 
            className="mt-4 p-4 rounded-2xl flex items-start gap-4 transition-all duration-300"
            style={{
              background: isDark ? "rgba(59, 130, 246, 0.05)" : "#EFF6FF",
              border: isDark ? "1px solid rgba(59, 130, 246, 0.1)" : "1px solid #DBEAFE"
            }}
          >
            <div className="p-2 rounded-xl" style={{ background: isDark ? "rgba(59, 130, 246, 0.1)" : "#DBEAFE" }}>
              <TrendingUp className={isDark ? "text-blue-400" : "text-blue-600"} size={20} />
            </div>
            <div className="flex-1">
              <h5 className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                Operational Insight
              </h5>
              <p className="text-sm leading-relaxed italic" style={{ color: textColor }}>
                "{insight}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
