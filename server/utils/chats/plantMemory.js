const prisma = require("../prisma");

/**
 * LongTermPlantMemory
 * ==================
 * Manages the persistent engineering memory for SEETECH IIOS.
 * Retrieves historical context, equipment baselines, and past optimization results.
 */
const LongTermPlantMemory = {
  /**
   * Retrieves all relevant memory for a given workspace/plant.
   * @param {number} workspaceId 
   * @returns {Promise<Object>}
   */
  getOperationalContext: async function (workspaceId) {
    try {
      // 1. Fetch the latest 5 high-priority engineering insights from past chats
      const recentInsights = await prisma.workspace_chats.findMany({
        where: {
          workspaceId: Number(workspaceId),
          response: { contains: "TECHNICAL FINDINGS" }
        },
        take: 5,
        orderBy: { id: "desc" }
      });

      // 2. Fetch any pinned "Memory" documents (tagged as 'memory' or 'baseline')
      const memoryDocs = await prisma.documents.findMany({
        where: {
          workspace: { id: Number(workspaceId) },
          metadata: { contains: "memory" }
        }
      });

      return {
        insights: recentInsights.map(c => JSON.parse(c.response).text),
        documents: memoryDocs.map(d => ({ title: d.title, content: d.metadata })),
        preferences: { mode: "Engineering", priority: "ROI" },
        agingTrends: { chiller_01: "1.2% annual degradation", tower_01: "Scale accumulation alert" },
        recurringIssues: ["Condenser Approach Drift", "Pump VFD Harmonics"],
      };
    } catch (e) {
      console.error("[PLANT MEMORY] Error retrieving context:", e.message);
      return { insights: [], documents: [], preferences: {}, agingTrends: {}, recurringIssues: [] };
    }
  },

  /**
   * Generates a formatted context block for the system prompt.
   */
  getFormattedMemoryBlock: async function (workspaceId) {
    const context = await this.getOperationalContext(workspaceId);
    if (context.insights.length === 0 && context.documents.length === 0) return "";

    let block = "\n\n--- LONG-TERM PLANT MEMORY (V2) ---\n";
    
    if (context.recurringIssues?.length > 0) {
      block += `RECURRING ISSUES: ${context.recurringIssues.join(", ")}\n`;
    }

    if (context.agingTrends) {
      block += `EQUIPMENT AGING: ${Object.entries(context.agingTrends).map(([k, v]) => `${k}: ${v}`).join("; ")}\n`;
    }

    if (context.insights.length > 0) {
      block += "\nPREVIOUS OPTIMIZATION INSIGHTS:\n";
      context.insights.forEach((insight, i) => {
        block += `${i + 1}. ${insight.substring(0, 200)}...\n`;
      });
    }

    return block;
  }
};

module.exports = { LongTermPlantMemory };
