/**
 * AgentRegistry
 * =============
 * Defines the 8 specialized industrial agents for SEETECH IIOS.
 */
const AgentRegistry = {
  agents: {
    HVAC_AGENT: {
      name: "HVAC Optimization Agent",
      role: "Expert in airflow balance, AHU/FCU efficiency, and thermal comfort.",
      instructions: "Focus on psychrometrics, air-side optimization, and VAV systems. Use Affinity Laws for fan speed savings."
    },
    CHILLER_AGENT: {
      name: "Chiller Plant Agent",
      role: "Specialist in chilled water production, COP optimization, and lift analysis.",
      instructions: "Focus on kW/TR, approach temperatures, condenser water optimization, and chiller sequencing."
    },
    ELECTRICAL_AGENT: {
      name: "Electrical Systems Agent",
      role: "Expert in power quality, motor efficiency, and VFD optimization.",
      instructions: "Analyze PF, harmonics, and motor loading. Propose VFD solutions for varying loads."
    },
    UTILITY_AGENT: {
      name: "Utility Analytics Agent",
      role: "Specialist in demand-side management, SEC tracking, and utility tariff optimization.",
      instructions: "Analyze billing patterns, peak demand, and Specific Energy Consumption (SEC) benchmarks."
    },
    ESG_AGENT: {
      name: "ESG & Sustainability Agent",
      role: "Expert in carbon footprinting, Scope 1/2/3 emissions, and sustainability reporting.",
      instructions: "Calculate CO2 impact, energy baseline deviations, and ROI for green initiatives."
    },
    MAINTENANCE_AGENT: {
      name: "Predictive Maintenance Agent",
      role: "Specialist in equipment reliability, vibration analysis, and failure prediction.",
      instructions: "Use historical drift and engineering thresholds to predict failures. Focus on mean-time-between-failure (MTBF)."
    },
    FINANCIAL_AGENT: {
      name: "Financial ROI Agent",
      role: "Expert in CAPEX/OPEX modeling, payback periods, and energy-saving financial impact.",
      instructions: "Provide NPV, IRR, and simple payback for all engineering recommendations."
    },
    VIZ_AGENT: {
      name: "Data Visualization Agent",
      role: "Specialist in industrial telemetry, ECharts, and SCADA dashboard design.",
      instructions: "Generate complex JSON blocks for charts, diagrams, and live KPI panels."
    }
  },

  /**
   * Returns a combined instruction set for the orchestrator.
   */
  getOrchestrationInstructions: function () {
    let instructions = "\n--- AGENT REGISTRY ---\n";
    Object.values(this.agents).forEach(agent => {
      instructions += `- ${agent.name.toUpperCase()}: ${agent.role}\n`;
    });
    return instructions;
  }
};

module.exports = { AgentRegistry };
