/**
 * SEETECH AI — Response Sanitization Engine (v6.0.0)
 * Hardened filter to prevent LLM artifacts and forbidden code blocks from reaching the UI.
 */
class Sanitizer {
  static STREAM_FORBIDDEN_PATTERNS = [
    /json\s*copy/gi,
    /text\s*copy/gi,
    /<think>[\s\S]*?<\/think>/gi,
    /<analysis>[\s\S]*?<\/analysis>/gi,
    /<reflection>[\s\S]*?<\/reflection>/gi,
    /<think>[\s\S]*/i, // Partial/unclosed think tag
    /<analysis>[\s\S]*/i, // Partial/unclosed analysis tag
  ];

  static FULL_FORBIDDEN_PATTERNS = [
    /json\s*copy/gi,
    /text\s*copy/gi,
    /<think>[\s\S]*?<\/think>/gi,
    /<analysis>[\s\S]*?<\/analysis>/gi,
    /<reflection>[\s\S]*?<\/reflection>/gi,
  ];

  /**
   * Sanitizes text chunks before they are sent to the frontend.
   * @param {string} text 
   * @returns {string}
   */
  static sanitize(text) {
    if (!text || typeof text !== "string") return text;
    let sanitized = text;

    try {
      for (const pattern of this.STREAM_FORBIDDEN_PATTERNS) {
        sanitized = sanitized.replace(pattern, "");
      }

      // --- SEETECH FAILSAFE (v6.2) ---
      if (text.trim().length > 0 && sanitized.trim().length === 0) {
        return ""; 
      }

      return sanitized;
    } catch (err) {
      console.error(`\x1b[31m[SANITIZER ERROR]\x1b[0m`, err.message);
      return text;
    }
  }

  /**
   * Cleans the full response before it is saved to the database.
   * @param {string} text 
   * @returns {string}
   */
  static cleanFullResponse(text) {
    if (!text || typeof text !== "string") return text;
    
    try {
      let cleaned = text;
      for (const pattern of this.FULL_FORBIDDEN_PATTERNS) {
        cleaned = cleaned.replace(pattern, "");
      }

      if (!cleaned || cleaned.trim().length === 0) return text;

      // Remove duplicate headers
      const lines = cleaned.split("\n");
      const uniqueHeaders = new Set();
      const resultLines = [];

      for (const line of lines) {
        if (line.trim().startsWith("#")) {
          const header = line.trim().toLowerCase();
          if (uniqueHeaders.has(header)) continue; 
          uniqueHeaders.add(header);
        }
        resultLines.push(line);
      }

      const finalOutput = resultLines.join("\n").trim();
      return finalOutput.length > 0 ? finalOutput : text;
    } catch (err) {
      console.error(`\x1b[31m[SANITIZER CLEAN ERROR]\x1b[0m`, err.message);
      return text;
    }
  }
}

module.exports = { Sanitizer };
