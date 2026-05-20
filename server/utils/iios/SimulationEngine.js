/**
 * SimulationEngine
 * ================
 * Performs 'What-if' engineering analysis for SEETECH IIOS.
 */
const { IndustrialCalculations } = require("../helpers/industrialCalculations");

const SimulationEngine = {
  /**
   * Simulates a setpoint change (e.g., reducing CW temperature).
   */
  simulateSetpointChange: function (currentCOP, currentPower, deltaTemp) {
    // Industrial Rule: Reducing CW temp by 1°C improves chiller efficiency by approx 2-3%.
    const efficiencyGain = Math.abs(deltaTemp) * 0.025; 
    const newCOP = currentCOP * (1 + efficiencyGain);
    const savedPower = currentPower * efficiencyGain;

    return {
      originalCOP: currentCOP,
      simulatedCOP: newCOP.toFixed(3),
      powerSavingsKW: savedPower.toFixed(2),
      confidence: 0.85,
    };
  },

  /**
   * Simulates VFD speed reduction using Affinity Laws.
   */
  simulateVFDChange: function (oldPower, oldHz, newHz) {
    const newPower = IndustrialCalculations.calculateAffinityPower(oldPower, oldHz, newHz);
    return {
      originalPower: oldPower,
      simulatedPower: newPower.toFixed(2),
      savingsKW: (oldPower - newPower).toFixed(2),
      confidence: 0.95,
    };
  }
};

module.exports = { SimulationEngine };
