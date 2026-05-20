import React from "react";
import { useBranding } from "@/BrandingContext";
import { ChartLineUp, Wind, ShieldCheck, Gear } from "@phosphor-icons/react";
import MenuCards from "../SEETECH/MenuCards";

export default function WelcomeMessage({ sendCommand }) {
  const { branding } = useBranding();
  const { primaryColor } = branding;

  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto min-h-0 text-center space-y-6 py-4 md:py-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 px-6 max-w-5xl mx-auto w-full no-scroll font-sans">
      <div className="space-y-6 w-full">
        {/* Premium Industrial Header */}
        <div className="space-y-3 flex flex-col items-center">
          {/* Top Kicker Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 light:bg-blue-50 border border-cyan-500/20 light:border-blue-200 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 light:bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-extrabold text-cyan-400 light:text-blue-700 tracking-[0.2em] uppercase">
              AI-POWERED ENERGY OPTIMIZATION
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-xl md:text-2xl font-extrabold text-white light:text-slate-900 tracking-tight leading-tight drop-shadow-xl max-w-4xl mx-auto">
            SEETECH Industrial Intelligence Operating System
          </h1>

          {/* Subtitle / Description */}
          <p className="text-xs md:text-sm text-white/70 light:text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Unified AI Platform for Energy Efficiency, Operational Analytics & Plant Optimization
          </p>
        </div>
        
        {/* Clickable Action Menu Cards */}
        <MenuCards sendCommand={sendCommand} primaryColor={primaryColor} />
      </div>
    </div>
  );
}
