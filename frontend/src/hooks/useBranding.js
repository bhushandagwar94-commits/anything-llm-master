import { useEffect, useState } from "react";
import System from "@/models/system";

/**
 * useBranding Hook
 * ================
 * Hydrates CSS variables from Antigravity branding configuration.
 */
export default function useBranding() {
  const [branding, setBranding] = useState(null);

  const applyBranding = (config) => {
    if (!config) return;
    const root = document.documentElement;
    
    // Map design tokens to CSS variables
    const tokenMap = {
      primaryColor: "--iios-custom-primary",
      secondaryColor: "--iios-custom-secondary",
      glowStrength: "--iios-custom-glow",
      glassOpacity: "--iios-custom-glass-opacity",
      panelBlur: "--iios-custom-blur",
      bgGradient: "--iios-custom-bg",
      borderRadius: "--iios-custom-radius",
      animationSpeed: "--iios-custom-speed",
    };

    Object.entries(config).forEach(([key, value]) => {
      const varName = tokenMap[key];
      if (varName) root.style.setProperty(varName, value);
    });

    console.log("\x1b[32m[ANTIGRAVITY HYDRATION]\x1b[0m CSS Variables updated globally.");
  };

  const fetchBranding = async () => {
    try {
      // In a real scenario, this calls GET /api/system/branding-config
      // For now, we use a fallback or wait for System model expansion
      const config = await System.getBrandingConfig(); 
      setBranding(config);
      applyBranding(config);
    } catch (e) {
      console.warn("[BRANDING] Failed to fetch config, using defaults.");
    }
  };

  useEffect(() => {
    fetchBranding();

    // Listen for real-time branding updates
    const handleUpdate = () => {
      console.log("\x1b[34m[PUBLIC THEME SYNC]\x1b[0m Branding update event detected.");
      fetchBranding();
    };

    window.addEventListener("BRANDING_UPDATED", handleUpdate);
    return () => window.removeEventListener("BRANDING_UPDATED", handleUpdate);
  }, []);

  return branding;
}
