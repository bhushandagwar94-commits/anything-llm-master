/**
 * SEETECH AI — Greeting Generator (v6.0.0)
 * Generates premium, deterministic greetings for the industrial intelligence platform.
 */

class GreetingGenerator {
  static HARDCODED_GREETING = `⚡ Welcome to SEETECH AI Industrial Intelligence Platform

🟢 SEETECH AI is online and ready for advanced engineering analysis.

I am your specialized Industrial Engineering & Energy Performance Copilot, designed to transform operational plant data into actionable industrial intelligence — improving reliability, reducing operating costs, increasing efficiency, and supporting sustainability goals.

━━━━━━━━━━━━━━━━━━
🔹 SEETECH AI Core Capabilities
━━━━━━━━━━━━━━━━━━

❄️ HVAC & Chiller Optimization
Advanced analysis of chiller plants, cooling towers, AHUs, and HVAC performance systems.

⚡ Energy Intelligence & KPI Analytics
Real-time SEC tracking, kW/TR analysis, COP monitoring, and ROI-driven optimization.

🔧 Predictive Diagnostics
Early detection of operational drift, motor inefficiencies, pump performance losses, and equipment anomalies.

📊 Industrial Visual Analytics
Interactive engineering dashboards, trend analysis, Sankey diagrams, and dynamic KPI visualizations.

🏭 Utility & Process Optimization
Compressed air systems, steam systems, boilers, electrical load balancing, and utility efficiency improvements.

🌱 ESG & Sustainability Intelligence
Carbon reduction insights, energy conservation strategies, and sustainability-focused operational recommendations.

━━━━━━━━━━━━━━━━━━
📌 How SEETECH AI Can Assist You
━━━━━━━━━━━━━━━━━━

✔️ Analyze industrial equipment performance
✔️ Review plant energy consumption trends
✔️ Generate professional engineering dashboards
✔️ Diagnose inefficiencies & operational losses
✔️ Simulate optimization opportunities
✔️ Create ROI-focused energy-saving recommendations

━━━━━━━━━━━━━━━━━━
🚀 Get Started
━━━━━━━━━━━━━━━━━━

You can begin by:

📂 Uploading operational or utility data
📈 Requesting KPI or trend analysis
⚙️ Asking an engineering or maintenance question
🧠 Generating an industrial optimization dashboard
🔍 Investigating equipment performance issues

What would you like SEETECH AI to analyze today?`;

  static SUGGESTIONS = [
    "Analyze chiller efficiency",
    "Calculate SEC for my plant",
    "Upload plant telemetry",
    "How can I optimize HVAC?"
  ];

  /**
   * Generates a premium SEETECH greeting response.
   * @returns {Object}
   */
  static generateSEETECHGreeting() {
    console.log(`\x1b[34m[GREETING TEMPLATE LOADED]\x1b[0m Using hardcoded greeting prompt...`);
    
    return {
      type: "greeting",
      mode: "casual",
      response: this.HARDCODED_GREETING,
      suggestions: this.SUGGESTIONS,
    };
  }

  /**
   * Fallback static greeting in case of generator failure.
   * @returns {Object}
   */
  static getFallbackGreeting() {
    return {
      type: "greeting",
      mode: "casual",
      response: this.HARDCODED_GREETING,
      suggestions: this.SUGGESTIONS,
    };
  }
}

module.exports = { GreetingGenerator };
