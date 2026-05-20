/**
 * IndustrialCalculations
 * =====================
 * Engineering formula library for SEETECH IIOS.
 */
const IndustrialCalculations = {
  // HVAC & Chiller Formulas
  calculateCOP: (coolingLoadKW, inputPowerKW) => coolingLoadKW / inputPowerKW,
  calculateKWPerTon: (inputPowerKW, coolingTons) => inputPowerKW / coolingTons,
  
  // Affinity Laws (Fans/Pumps)
  // NewPower = OldPower * (NewRPM/OldRPM)^3
  calculateAffinityPower: (oldPower, oldRPM, newRPM) => {
    return oldPower * Math.pow(newRPM / oldRPM, 3);
  },

  // Specific Energy Consumption (SEC)
  calculateSEC: (totalEnergyKWH, productionUnits) => totalEnergyKWH / productionUnits,

  // Thermal Drift & Approach
  // Approach = Leaving Fluid Temp - Entering Fluid Temp
  calculateApproach: (leavingTemp, enteringTemp) => Math.abs(leavingTemp - enteringTemp),

  /**
   * Detects operational drift by comparing current value to baseline.
   * Returns percentage deviation.
   */
  detectDrift: (current, baseline) => {
    if (!baseline || baseline === 0) return 0;
    return ((current - baseline) / baseline) * 100;
  }
};

module.exports = { IndustrialCalculations };
