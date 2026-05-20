const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { EncryptionManager } = require("../EncryptionManager");
const { getLLMProvider } = require("../helpers");

class ProviderOrchestrator {
  constructor() {
    this.registry = {};
    this.initialized = false;
    this.encryption = new EncryptionManager();
  }

  log(text, ...args) {
    console.log(`\x1b[35m[LLM ORCHESTRATOR]\x1b[0m ${text}`, ...args);
  }

  async initialize() {
    if (this.initialized) return;
    this.log("Initializing AI Provider Registry...");
    await this.syncWithDatabase();
    this.initialized = true;
    this.log("Registry initialized.");
  }

  async syncWithDatabase() {
    try {
      const { KeyManager, GlobalKeyManager } = require("../providers/KeyManager");
      
      // We will reload all active providers
      const providers = ["openai", "anthropic", "gemini", "openrouter", "groq", "mistral"];
      this.registry = {};
      
      for (const provider of providers) {
        const keys = await GlobalKeyManager.getKeysForProvider(provider);
        if (keys.length > 0) {
          this.registry[provider] = keys;
        }
      }

      // Import from .env if registry is empty for a provider
      await this.importFromEnv();
    } catch (e) {
      this.log("Database sync failed, falling back to .env only.", e.message);
      await this.importFromEnv();
    }
  }

  async importFromEnv() {
    const { KeyManager, GlobalKeyManager } = require("../providers/KeyManager");
    const envMappings = {
      openai: process.env.OPEN_AI_KEY || process.env.OPENAI_KEYS,
      anthropic: process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_KEYS,
      gemini: process.env.GEMINI_API_KEY || process.env.GEMINI_KEYS,
      openrouter: process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEYS,
    };

    for (const [provider, envValue] of Object.entries(envMappings)) {
      if (!envValue) continue;
      
      const keys = KeyManager.parseEnvKeys(envValue);
      for (const [index, key] of keys.entries()) {
        const label = index === 0 ? "System Default (.env)" : `System Key ${index + 1} (.env)`;
        const existing = await prisma.llm_provider_keys.findFirst({
          where: { provider, label }
        });

        if (!existing) {
          this.log(`Importing ${provider} key (${label}) from .env to database...`);
          await prisma.llm_provider_keys.create({
            data: {
              provider,
              label,
              encrypted_key: this.encryption.encrypt(key),
              active: true,
              priority: 100 - index, // Slightly lower priority for secondary keys
            }
          });
        }
      }
    }
  }

  async getProvider(providerName, modelOverride = null) {
    if (!this.initialized) await this.initialize();
    return this.getProviderSync(providerName, modelOverride);
  }

  getProviderSync(providerName, modelOverride = null) {
    const providerKeys = this.registry[providerName] || [];
    const activeKeys = providerKeys.filter(
      (k) => k.active && (!k.cooldown_until || k.cooldown_until < new Date())
    );

    if (activeKeys.length === 0) return null;

    const { ManagedLLMProvider } = require("./ManagedLLMProvider");
    return new ManagedLLMProvider(providerName, activeKeys, modelOverride);
  }

  getEmbedderSync(providerName) {
    const providerKeys = this.registry[providerName] || [];
    const activeKeys = providerKeys.filter(
      (k) => k.active && (!k.cooldown_until || k.cooldown_until < new Date())
    );

    if (activeKeys.length === 0) return null;

    const { ManagedEmbeddingProvider } = require("./ManagedEmbeddingProvider");
    return new ManagedEmbeddingProvider(providerName, activeKeys);
  }

  async reload() {
    this.initialized = false;
    await this.initialize();
  }
}

const GlobalProviderOrchestrator = new ProviderOrchestrator();
module.exports = { GlobalProviderOrchestrator };
