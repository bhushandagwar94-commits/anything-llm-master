import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import FooterCustomization from "../components/FooterCustomization";
import SupportEmail from "../components/SupportEmail";
import CustomLogo from "../components/CustomLogo";
import { useTranslation } from "react-i18next";
import CustomAppName from "../components/CustomAppName";
import CustomSiteSettings from "../components/CustomSiteSettings";
import PublicChatBranding from "../components/PublicChatBranding";
import { Sparkle, ShieldCheck } from "@phosphor-icons/react";

export default function BrandingSettings() {
  const { t } = useTranslation();

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex font-sans">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[24px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-8 shadow-2xl border border-white/5 light:border-slate-200/60"
      >
        <div className="flex flex-col w-full max-w-5xl mx-auto pb-16">
          {/* Top Premium Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-cyan-900/40 light:from-blue-600 light:via-indigo-600 light:to-cyan-500 p-8 border border-white/10 light:border-transparent shadow-xl mb-8">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-48 h-48 bg-cyan-500/20 light:bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-x-2.5 mb-2">
                  <span className="p-2 rounded-xl bg-cyan-500/20 light:bg-white/20 text-cyan-400 light:text-white border border-cyan-500/30 light:border-white/30 backdrop-blur-md">
                    <Sparkle className="w-6 h-6 animate-pulse" />
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {t("customization.branding.title")} & Whitelabeling
                  </h1>
                </div>
                <p className="text-sm text-white/80 light:text-white/90 max-w-2xl font-medium leading-relaxed">
                  {t("customization.branding.description")} Configure your enterprise platform identity, custom brand logo, support contact, and public chatbot aesthetics. All changes reflect instantly.
                </p>
              </div>
              <div className="flex items-center gap-x-2 px-4 py-2.5 rounded-2xl bg-white/10 light:bg-black/10 backdrop-blur-md border border-white/15 w-fit shrink-0">
                <ShieldCheck className="w-5 h-5 text-cyan-400 light:text-white" />
                <span className="text-xs font-bold text-white tracking-wider uppercase">Enterprise License</span>
              </div>
            </div>
          </div>

          {/* Whitelabeling Forms Grid/Stack */}
          <div className="space-y-8">
            <CustomAppName />
            <CustomLogo />
            <PublicChatBranding />
            <FooterCustomization />
            <SupportEmail />
            <CustomSiteSettings />
          </div>
        </div>
      </div>
    </div>
  );
}

