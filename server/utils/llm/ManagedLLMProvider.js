const { getLLMProvider, getEmbeddingEngineSelection } = require("../helpers");
const prisma = require("../prisma");

class ManagedLLMProvider {
  constructor(providerName, keys, modelOverride = null) {
    this.providerName = providerName;
    this.keys = keys;
    this.modelOverride = modelOverride;
    this.currentKeyIndex = 0;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[MANAGED PROVIDER: ${this.providerName}]\x1b[0m ${text}`, ...args);
  }

  async #executeWithFailover(action) {
    let lastError = null;

    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const activeKey = this.keys[this.currentKeyIndex];
      this.log(`Attempting request with key: ${activeKey.label || activeKey.id}`);

      try {
        // Set environment variable temporarily for the provider to pick up
        // This is a bit hacky but avoids refactoring every single provider file
        const envKey = this.#getEnvKeyName(this.providerName);
        const originalValue = process.env[envKey];
        process.env[envKey] = activeKey.apiKey;

        const provider = getLLMProvider({ 
          provider: this.providerName, 
          model: this.modelOverride || activeKey.model,
          _bypassOrchestrator: true,
        });

        const result = await action(provider);
        
        // Restore environment
        process.env[envKey] = originalValue;
        
        // Mark success
        await this.#reportHealth(activeKey.id, true);
        return result;

      } catch (e) {
        lastError = e;
        this.log(`Request failed: ${e.message}`);

        if (this.#isRetryable(e)) {
          this.log(`Triggering failover rotation...`);
          await this.#reportHealth(activeKey.id, false, e.message);
          this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
          continue;
        }

        throw e;
      }
    }

    throw lastError;
  }

  #getEnvKeyName(provider) {
    const maps = {
      openai: "OPEN_AI_KEY",
      anthropic: "ANTHROPIC_API_KEY",
      gemini: "GEMINI_API_KEY",
      openrouter: "OPENROUTER_API_KEY",
      groq: "GROQ_API_KEY",
      mistral: "MISTRAL_API_KEY",
      perplexity: "PERPLEXITY_API_KEY",
    };
    return maps[provider] || `${provider.toUpperCase()}_API_KEY`;
  }

  #isRetryable(error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes("429") || 
      msg.includes("rate limit") || 
      msg.includes("401") || 
      msg.includes("unauthorized") ||
      msg.includes("timeout") ||
      msg.includes("500") ||
      msg.includes("quota")
    );
  }

  async #reportHealth(keyId, success, error = null) {
    const { GlobalKeyManager } = require("../providers/KeyManager");
    if (success) {
      await GlobalKeyManager.reportSuccess(keyId);
    } else {
      await GlobalKeyManager.reportFailure(keyId, error);
    }
  }

  // Construct a raw provider instance (bypasses orchestrator to prevent recursion)
  #getRawProvider(model = null) {
    const { getLLMProvider } = require("../helpers");
    return getLLMProvider({ provider: this.providerName, model: model || this.modelOverride, _bypassOrchestrator: true });
  }

  // Proxy methods to the real provider
  async getChatCompletion(messages, options) {
    return await this.#executeWithFailover((p) => p.getChatCompletion(messages, options));
  }

  async streamGetChatCompletion(messages, options) {
    return await this.#executeWithFailover((p) => p.streamGetChatCompletion(messages, options));
  }

  streamingEnabled() { return true; }
  promptWindowLimit(model) { 
    return this.#getRawProvider(model).promptWindowLimit(model); 
  }
  isValidChatCompletionModel(model) { return true; }
  constructPrompt(args) { 
    return this.#getRawProvider().constructPrompt(args); 
  }
  async compressMessages(args, history) {
    return await this.#getRawProvider().compressMessages(args, history);
  }
  async handleStream(response, stream, props) {
    return await this.#getRawProvider().handleStream(response, stream, props);
  }

  async embedTextInput(text) {
    return await this.#executeWithFailover((p) => p.embedTextInput(text));
  }

  async embedChunks(chunks) {
    return await this.#executeWithFailover((p) => p.embedChunks(chunks));
  }
}

module.exports = { ManagedLLMProvider };
