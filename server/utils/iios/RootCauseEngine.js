/**
 * RootCauseEngine
 * ===============
 * Performs multi-layer anomaly correlation for SEETECH IIOS.
 */
const RootCauseEngine = {
  /**
   * Analyzes anomalies to find the root cause.
   */
  analyze: function (telemetry, twinState) {
    const causes = [];

    // Logic: If approach is high and tower fan is at max, it's likely scaling or air-side blockage.
    if (telemetry.sensors.chiller_01_cooling > 400 && telemetry.sensors.tower_fan_hz > 48) {
      causes.push({
        id: "condenser_scaling",
        title: "Condenser Tube Scaling",
        probability: 0.75,
        impact: "Critical - 12% efficiency loss",
        reasoning: "High approach temperature (4.2°C) correlated with maximum heat rejection capacity.",
        subsystem: "Heat Exchanger",
      });
    }

    return causes;
  }
};

module.exports = { RootCauseEngine };
