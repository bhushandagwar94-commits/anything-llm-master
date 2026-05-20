const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { EncryptionManager } = require("../EncryptionManager");
const { GlobalHealthMonitor } = require("../llm/ProviderHealthMonitor");

class KeyManager {
  constructor() {
    this.encryption = new EncryptionManager();
    this.providers = {};
  }

  log(text, ...args) {
    console.log(`\x1b[35m[KEY MANAGER]\x1b[0m ${text}`, ...args);
  }

  /**
   * Securely load keys for a specific provider.
   * Prioritizes healthy, active keys with higher priority.
   */
  async getKeysForProvider(provider) {
    try {
      const keys = await prisma.llm_provider_keys.findMany({
        where: {
          provider,
          active: true,
          OR: [
            { cooldown_until: null },
            { cooldown_until: { lt: new Date() } }
          ]
        },
        orderBy: { priority: "desc" }
      });

      return keys.map(k => ({
        ...k,
        apiKey: this.encryption.decrypt(k.encrypted_key)
      }));
    } catch (e) {
      this.log(`Error loading keys for ${provider}:`, e.message);
      return [];
    }
  }

  /**
   * Marks a key as failed and triggers a temporary cooldown.
   */
  async reportFailure(keyId, error = "Unknown error") {
    const cooldown = new Date();
    cooldown.setMinutes(cooldown.getMinutes() + 5);

    this.log(`Key ${keyId} failed. Setting cooldown until ${cooldown.toISOString()}. Error: ${error}`);

    try {
      await prisma.llm_provider_keys.update({
        where: { id: keyId },
        data: {
          failure_count: { increment: 1 },
          health_score: { decrement: 10 },
          cooldown_until: cooldown,
          last_error: error.substring(0, 255)
        }
      });
    } catch (e) {
      this.log("Failed to report key failure to DB:", e.message);
    }
  }

  /**
   * Reports success for a key, increasing its health score.
   */
  async reportSuccess(keyId) {
    try {
      await prisma.llm_provider_keys.update({
        where: { id: keyId },
        data: {
          failure_count: 0,
          health_score: { increment: 5 },
          last_used_at: new Date(),
          use_count: { increment: 1 }
        }
      });
    } catch (e) {}
  }

  /**
   * Parses keys from .env string (comma separated)
   */
  static parseEnvKeys(envString) {
    if (!envString) return [];
    return envString.split(",").map(k => k.trim()).filter(k => k.length > 0 && !k.includes("******"));
  }
}

const GlobalKeyManager = new KeyManager();
module.exports = { KeyManager, GlobalKeyManager };
