import React from "react";
import useLogo from "@/hooks/useLogo";
import { useTranslation } from "react-i18next";
import ThemeToggle from "@/components/ThemeToggle";
import UserButton from "@/components/UserMenu/UserButton";
import { useBranding } from "@/BrandingContext";

export default function ChatWindowShell({ children, historyHeader = null, inputArea = null }) {
  const { logo } = useLogo();
  const { t } = useTranslation();
  const { branding } = useBranding();

  return (
    <div className="outer-page">
      <div className="app-window">
        {/* Application Header Bar */}
        <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 light:border-slate-200 bg-white/5 light:bg-white/85 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-x-4">
            {logo && (
              <img
                src={logo}
                alt="SEETECH Logo"
                className="w-auto h-10 max-h-[40px] object-contain animate-fadeIn"
              />
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-x-2">
                <h1 className="text-white light:text-slate-900 text-lg font-bold tracking-tight">
                  {branding.heading}
                </h1>
                <div className="status-dot" title="System Online" />
              </div>
              <p className="text-white/40 light:text-slate-500 text-xs font-medium uppercase tracking-widest">
                {branding.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-x-6">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-white/60 light:text-slate-600 text-xs font-semibold">
                SYSTEM STATUS
              </p>
              <p className="text-green-400 text-[10px] font-bold uppercase tracking-tighter">
                Operational • v2.4.0
              </p>
            </div>
            <ThemeToggle />
            <UserButton isStatic={true} />
          </div>
        </div>

        {/* Chat History Section */}
        <div className="flex-1 relative flex flex-row min-h-0 overflow-hidden">
          {children}
        </div>

        {/* Fixed Input Bar Section */}
        <div className="chat-input-container shrink-0">
          <div className="max-w-4xl mx-auto w-full">
            {inputArea}
          </div>
        </div>
      </div>
    </div>
  );
}
