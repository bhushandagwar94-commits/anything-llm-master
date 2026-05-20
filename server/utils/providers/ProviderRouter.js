const { GlobalProviderOrchestrator } = require("../llm/ProviderOrchestrator");

class ProviderRouter {
  constructor() {
    this.primaryProvider = process.env.LLM_PROVIDER || "openai";
    this.fallbackChain = ["openai", "anthropic", "gemini", "openrouter", "groq", "mistral"];
  }

  log(text, ...args) {
    console.log(`\x1b[34m[PROVIDER ROUTER]\x1b[0m ${text}`, ...args);
  }

  /**
   * Routes to the best available provider.
   * If the primary is down, it tries the fallback chain.
   */
  getProvider(preferredProvider = null, model = null) {
    const target = preferredProvider || this.primaryProvider;
    
    // Try preferred first
    const provider = GlobalProviderOrchestrator.getProviderSync(target, model);
    if (provider) return provider;

    this.log(`Primary provider ${target} is unavailable. Searching fallbacks...`);

    // Try fallbacks in order
    for (const fallback of this.fallbackChain) {
      if (fallback === target) continue;
      const fallbackProvider = GlobalProviderOrchestrator.getProviderSync(fallback, model);
      if (fallbackProvider) {
        this.log(`Successfully routed to fallback: ${fallback}`);
        return fallbackProvider;
      }
    }

    this.log("CRITICAL: All providers in the chain are unavailable.");
    return null;
  }

  /**
   * Routes to the best available embedding provider.
   */
  getEmbedder(preferredEmbedder = null) {
    const target = preferredEmbedder || process.env.EMBEDDING_ENGINE || "native";
    
    const embedder = GlobalProviderOrchestrator.getEmbedderSync(target);
    if (embedder) return embedder;

    // Fallback for embeddings is usually "native" (local Xenova) which should always work
    if (target !== "native") {
      this.log(`Embedding provider ${target} is unavailable. Falling back to native.`);
      return GlobalProviderOrchestrator.getEmbedderSync("native");
    }

    return null;
  }
}

const GlobalProviderRouter = new ProviderRouter();
module.exports = { GlobalProviderRouter };
