const { SystemSettings } = require("../../models/systemSettings");

/**
 * GlobalBrandingManager
 * ====================
 * Manages enterprise design tokens and synchronization for SEETECH IIOS.
 */
const GlobalBrandingManager = {
  // Default SEETECH Design Tokens
  defaults: {
    primaryColor: "#0ea5e9",
    secondaryColor: "#22d3ee",
    glassOpacity: "0.08",
    panelBlur: "12px",
    glowStrength: "15px",
    bgGradient: "linear-gradient(180deg, #0b0e14 0%, #111827 100%)",
    borderRadius: "1.25rem",
    animationSpeed: "0.3s",
  },

  /**
   * Retrieves the current branding configuration.
   */
  getBranding: async function () {
    try {
      const settings = await SystemSettings.get({ label: "antigravity_branding" });
      if (!settings) return this.defaults;
      return JSON.parse(settings.value);
    } catch (e) {
      console.error("[BRANDING] Error retrieving settings:", e.message);
      return this.defaults;
    }
  },

  /**
   * Saves new branding configuration and invalidates cache.
   */
  saveBranding: async function (config) {
    try {
      const mergedConfig = { ...this.defaults, ...config };
      await SystemSettings.updateSettings({ antigravity_branding: JSON.stringify(mergedConfig) });
      console.log("\x1b[32m[BRANDING SAVE]\x1b[0m Antigravity design tokens persisted to database.");
      return mergedConfig;
    } catch (e) {
      console.error("[BRANDING] Error saving settings:", e.message);
      return null;
    }
  }
};

module.exports = { GlobalBrandingManager };
