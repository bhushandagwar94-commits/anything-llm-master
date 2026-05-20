const prisma = require("../prisma");
const { getLLMProvider } = require("../helpers");
const { GlobalProviderOrchestrator } = require("./ProviderOrchestrator");

class ProviderHealthMonitor {
  constructor() {
    this.interval = null;
    this.checkFrequency = 5 * 60 * 1000; // Check every 5 minutes
  }

  log(text, ...args) {
    console.log(`\x1b[32m[HEALTH MONITOR]\x1b[0m ${text}`, ...args);
  }

  start() {
    if (this.interval) return;
    this.log("Starting Enterprise Health Monitor...");
    this.interval = setInterval(() => this.runChecks(), this.checkFrequency);
    // Run initial check after short delay
    setTimeout(() => this.runChecks(), 10000);
  }

  async runChecks() {
    this.log("Running scheduled health diagnostics...");
    try {
      const keys = await prisma.llm_provider_keys.findMany();

      for (const key of keys) {
        await this.checkKeyHealth(key);
      }

      await GlobalProviderOrchestrator.reload();
      this.log("Health check cycle complete.");
    } catch (e) {
      this.log("Health check cycle failed:", e.message);
    }
  }

  async checkKeyHealth(keyRecord) {
    try {
      // Temporarily set env for the check
      const envKey = this.#getEnvKeyName(keyRecord.provider);
      const originalValue = process.env[envKey];
      process.env[envKey] = GlobalProviderOrchestrator.encryption.decrypt(keyRecord.encrypted_key);

      const provider = getLLMProvider({ 
        provider: keyRecord.provider, 
        model: keyRecord.model 
      });

      const start = Date.now();
      // Simple ping test
      const response = await provider.getChatCompletion(
        [{ role: "user", content: "ping" }],
        { temperature: 0 }
      );
      const latency = Date.now() - start;

      process.env[envKey] = originalValue;

      if (response && response.textResponse) {
        await prisma.llm_provider_keys.update({
          where: { id: keyRecord.id },
          data: { 
            health_score: Math.min(100, (keyRecord.health_score || 0) + 10),
            failure_count: 0,
            cooldown_until: null,
            last_validated_at: new Date()
          }
        });
      } else {
        throw new Error("Invalid response");
      }
    } catch (e) {
      this.log(`Health check failed for ${keyRecord.provider} (${keyRecord.label}): ${e.message}`);
      await prisma.llm_provider_keys.update({
        where: { id: keyRecord.id },
        data: { 
          health_score: Math.max(0, (keyRecord.health_score || 0) - 20),
          failure_count: { increment: 1 }
        }
      });
    }
  }

  #getEnvKeyName(provider) {
    const maps = {
      openai: "OPEN_AI_KEY",
      anthropic: "ANTHROPIC_API_KEY",
      gemini: "GEMINI_API_KEY",
      openrouter: "OPENROUTER_API_KEY",
    };
    return maps[provider] || `${provider.toUpperCase()}_API_KEY`;
  }
}

const GlobalHealthMonitor = new ProviderHealthMonitor();
module.exports = { GlobalHealthMonitor };
