const { GreetingIntentDetector } = require("./GreetingIntentDetector");
const { GreetingGenerator } = require("./GreetingGenerator");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { EmbedChats } = require("../../models/embedChats");
const { writeResponseChunk } = require("../helpers/chat/responses");

/**
 * Orchestrates the hard greeting override for SEETECH AI.
 * Intercepts greetings, invalidates cache, and returns premium responses.
 */
async function handleGreetingOverride({
  workspace,
  message,
  user = null,
  thread = null,
  sessionId = null,
  embedId = null,
  uuid,
  response = null, // Express response object for streaming
}) {
  try {
    if (GreetingIntentDetector.isGreetingIntent(message)) {
      console.log(`\x1b[35m[GREETING OVERRIDE ACTIVE]\x1b[0m Bypassing LLM orchestration for: "${message}"`);

      // 1. Cache Invalidation: Reset thread history to ensure a clean state
      try {
        if (embedId) {
          await EmbedChats.markHistoryInvalid(embedId, sessionId);
        } else {
          await WorkspaceChats.markThreadHistoryInvalidV2({
            workspaceId: workspace.id,
            user_id: user?.id || null,
            thread_id: thread?.id || null,
            api_session_id: sessionId || null,
          });
        }
        console.log(`\x1b[34m[GREETING]\x1b[0m Cache invalidated successfully.`);
      } catch (e) {
        console.error("[GREETING] Cache invalidation failed:", e.message);
      }

      // 2. Generate Premium Greeting
      const greetingData = GreetingGenerator.generateSEETECHGreeting();

      // 3. Save Greeting to Database (as assistant response)
      let chatId = null;
      try {
        if (embedId) {
          const { chat } = await EmbedChats.new({
            embedId,
            prompt: message,
            response: {
              text: greetingData.response,
              sources: [],
              metrics: {},
            },
            sessionId,
          });
          chatId = chat?.id;
        } else {
          const { chat } = await WorkspaceChats.new({
            workspaceId: workspace.id,
            prompt: message,
            response: {
              text: greetingData.response,
              sources: [],
              metrics: {},
            },
            threadId: thread?.id || null,
            user,
            apiSessionId: sessionId,
          });
          chatId = chat?.id;
        }
        console.log(`\x1b[34m[GREETING]\x1b[0m Chat record saved. ID: ${chatId}`);
      } catch (e) {
        console.error("[GREETING] Failed to save chat record:", e.message);
      }

      // 4. Handle Response based on whether it's streaming or sync
      if (response) {
        // Streaming Response - Send as a single large chunk then finalize
        writeResponseChunk(response, {
          uuid,
          id: uuid, // Use both for compatibility
          type: "textResponseChunk",
          textResponse: greetingData.response,
          sources: [],
          close: false,
          error: false,
        });

        writeResponseChunk(response, {
          uuid,
          id: uuid,
          type: "finalizeResponseStream",
          close: true,
          error: false,
          chatId,
        });

        console.log(`\x1b[32m[GREETING RESPONSE RETURNED]\x1b[0m`);
        console.log(`\x1b[32m[GREETING BYPASS COMPLETE]\x1b[0m`);
        return true; // Handled
      } else {
        // Synchronous Response
        console.log(`\x1b[32m[GREETING RESPONSE RETURNED]\x1b[0m`);
        console.log(`\x1b[32m[GREETING BYPASS COMPLETE]\x1b[0m`);
        return {
          id: uuid,
          uuid,
          type: "textResponse",
          textResponse: greetingData.response,
          sources: [],
          close: true,
          error: null,
          chatId,
        };
      }
    }
  } catch (err) {
    console.error(`\x1b[31m[GREETING CRITICAL ERROR]\x1b[0m`, err.message);
  }

  return null; // Not a greeting or failed to handle
}

module.exports = { handleGreetingOverride };
