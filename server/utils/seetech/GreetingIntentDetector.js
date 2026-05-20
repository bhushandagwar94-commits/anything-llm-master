/**
 * SEETECH AI — Greeting Intent Detector (v6.0.0)
 * Deterministic greeting detection for industrial intelligence orchestration.
 */

class GreetingIntentDetector {
  static GREETING_PATTERNS = [
    /^hi+$/i,
    /^hii+$/i,
    /^hello+$/i,
    /^hey+$/i,
    /^good\s?(morning|evening|afternoon|day)$/i,
    /^greetings$/i,
    /^start$/i,
    /^help$/i,
    /^yo+$/i,
    /^hola$/i,
    /^howdy$/i,
    /^hi\s?there$/i,
    /^hello\s?there$/i,
    /^hello\s?seetech$/i,
    /^hi\s?seetech$/i,
    /^hows\s?it\s?going$/i,
    /^whats\s?up$/i,
    /^sup$/i,
  ];

  /**
   * Normalizes the input message for robust detection.
   * @param {string} message 
   * @returns {string}
   */
  static normalize(message) {
    if (!message) return "";
    return message
      .trim()
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Remove punctuation
      .replace(/\s{2,}/g, " "); // Collapse whitespace
  }

  /**
   * Detects if the message is a greeting intent.
   * @param {string} message 
   * @returns {boolean}
   */
  static isGreetingIntent(message) {
    const normalized = this.normalize(message);
    if (!normalized) return false;

    // 1. Exact Pattern Match
    for (const pattern of this.GREETING_PATTERNS) {
      if (pattern.test(normalized)) {
        console.log(`\x1b[32m[GREETING DETECTED]\x1b[0m Match: "${normalized}"`);
        return true;
      }
    }

    // 2. Fuzzy/Broad Match for short sentences
    const words = normalized.split(" ");
    if (words.length <= 4) {
      const firstWord = words[0];
      const greetings = ["hi", "hii", "hiii", "hello", "hey", "greetings", "yo", "hola"];
      const isGreetingStart = greetings.includes(firstWord);
      
      // If it starts with a greeting and has no technical keywords, it's a greeting
      const hasTechnicalKeywords = /(chiller|hvac|energy|kpi|data|upload|optimize|audit|report|system|twin|sensor|telemetry)/i.test(normalized);
      
      if (isGreetingStart && !hasTechnicalKeywords) {
        console.log(`\x1b[32m[GREETING DETECTED]\x1b[0m Fuzzy/Broad Match: "${normalized}"`);
        return true;
      }
    }

    return false;
  }
}

module.exports = { GreetingIntentDetector };
