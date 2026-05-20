import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import System from "@/models/system";

const BrandingContext = createContext();

export const SEETECH_BRANDING_UPDATED = "SEETECH_BRANDING_UPDATED";

const DEFAULT_BRANDING = {
  heading: "SEETECH AI",
  subtitle: "INDUSTRIAL INTELLIGENCE COPILOT",
  welcome_message: "Welcome to SEETECH AI.",
  suggested_prompts: "How can I help?,Tell me more.",
  placeholder: "Ask anything...",
  primaryColor: "#3B82F6",
  bgPrimary: "#0B0F19",
  typography: "Inter, sans-serif",
};

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(() => {
    const cached = localStorage.getItem("seetech_branding_cache");
    return cached ? JSON.parse(cached) : DEFAULT_BRANDING;
  });

  const applyCSSVariables = (config) => {
    if (!config) return;
    const root = document.documentElement;
    const tokenMap = {
      primaryColor: "--iios-custom-primary",
      secondaryColor: "--iios-custom-secondary",
      glowStrength: "--iios-custom-glow",
      glassOpacity: "--iios-custom-glass-opacity",
      panelBlur: "--iios-custom-blur",
      bgGradient: "--iios-custom-bg",
      bgPrimary: "--iios-custom-bg",
      borderRadius: "--iios-custom-radius",
      animationSpeed: "--iios-custom-speed",
    };

    Object.entries(config).forEach(([key, value]) => {
      const varName = tokenMap[key];
      if (varName) root.style.setProperty(varName, value);
    });
    console.log("\x1b[32m[BRANDING HYDRATION]\x1b[0m CSS Variables updated.");
  };

  const fetchBranding = useCallback(async () => {
    try {
      const config = await System.getBrandingConfig();
      if (config) {
        setBranding(config);
        applyCSSVariables(config);
        localStorage.setItem("seetech_branding_cache", JSON.stringify(config));
      }
    } catch (error) {
      console.error("Failed to fetch branding config:", error);
    }
  }, []);

  useEffect(() => {
    fetchBranding();

    const handleUpdate = () => {
      console.log("\x1b[34m[BRANDING SYNC]\x1b[0m Refreshing branding context...");
      fetchBranding();
    };

    window.addEventListener("BRANDING_UPDATED", handleUpdate);
    window.addEventListener(SEETECH_BRANDING_UPDATED, handleUpdate);
    return () => {
      window.removeEventListener("BRANDING_UPDATED", handleUpdate);
      window.removeEventListener(SEETECH_BRANDING_UPDATED, handleUpdate);
    };
  }, [fetchBranding]);

  return (
    <BrandingContext.Provider value={{ branding, refreshBranding: fetchBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
}
