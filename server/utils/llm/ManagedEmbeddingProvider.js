const { GlobalKeyManager } = require("../providers/KeyManager");
const { getEmbeddingEngineSelection } = require("../helpers");
const prisma = require("../prisma");

class ManagedEmbeddingProvider {
  constructor(providerName, keys) {
    this.providerName = providerName;
    this.keys = keys;
    this.currentKeyIndex = 0;
  }

  log(text, ...args) {
    console.log(`\x1b[32m[MANAGED EMBEDDER: ${this.providerName}]\x1b[0m ${text}`, ...args);
  }

  async #executeWithFailover(action) {
    let lastError = null;

    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const activeKey = this.keys[this.currentKeyIndex];
      this.log(`Attempting embedding with key: ${activeKey.label || activeKey.id}`);

      try {
        const envKey = this.#getEnvKeyName(this.providerName);
        const originalValue = process.env[envKey];
        process.env[envKey] = activeKey.apiKey;

        const embedder = getEmbeddingEngineSelection({ 
          provider: this.providerName,
          _bypassOrchestrator: true 
        });

        const result = await action(embedder);
        process.env[envKey] = originalValue;
        
        await GlobalKeyManager.reportSuccess(activeKey.id);
        return result;

      } catch (e) {
        lastError = e;
        this.log(`Embedding failed: ${e.message}`);

        if (this.#isRetryable(e)) {
          await GlobalKeyManager.reportFailure(activeKey.id, e.message);
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
      azure: "AZURE_OPENAI_KEY",
      gemini: "GEMINI_EMBEDDING_API_KEY",
      openrouter: "OPENROUTER_API_KEY",
      cohere: "COHERE_API_KEY",
      voyageai: "VOYAGEAI_API_KEY",
    };
    return maps[provider] || `${provider.toUpperCase()}_API_KEY`;
  }

  #isRetryable(error) {
    const msg = error.message.toLowerCase();
    return msg.includes("429") || msg.includes("rate limit") || msg.includes("timeout") || msg.includes("500");
  }

  async embedTextInput(text) {
    return await this.#executeWithFailover((e) => e.embedTextInput(text));
  }

  async embedChunks(chunks) {
    return await this.#executeWithFailover((e) => e.embedChunks(chunks));
  }

  get model() { return this.#getRawEmbedder().model; }
  get maxConcurrentChunks() { return this.#getRawEmbedder().maxConcurrentChunks; }
  get embeddingMaxChunkLength() { return this.#getRawEmbedder().embeddingMaxChunkLength; }

  #getRawEmbedder() {
    const { getEmbeddingEngineSelection } = require("../helpers");
    return getEmbeddingEngineSelection({ provider: this.providerName, _bypassOrchestrator: true });
  }
}

module.exports = { ManagedEmbeddingProvider };
