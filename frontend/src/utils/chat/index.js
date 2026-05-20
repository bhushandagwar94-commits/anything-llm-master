import { THREAD_RENAME_EVENT } from "@/components/Sidebar/ActiveWorkspaces/ThreadContainer";
import { emitAssistantMessageCompleteEvent } from "@/components/contexts/TTSProvider";
import { sanitizeAssistantOutput } from "./sanitize";
export const ABORT_STREAM_EVENT = "abort-chat-stream";

// For handling of chat responses in the frontend by their various types.
export default function handleChat(
  chatResult,
  setLoadingResponse,
  setChatHistory,
  remHistory,
  _chatHistory,
  setWebsocket
) {
  const {
    uuid,
    textResponse,
    type,
    sources = [],
    error,
    close,
    animate = false,
    chatId = null,
    action = null,
    metrics = {},
  } = chatResult;

  if (type === "abort" || type === "statusResponse") {
    setLoadingResponse(false);
    setChatHistory([
      ...remHistory,
      {
        type,
        uuid,
        content: sanitizeAssistantOutput(textResponse),
        role: "assistant",
        sources,
        closed: true,
        error,
        animate,
        pending: false,
        metrics,
      },
    ]);
  } else if (type === "textResponse") {
    setLoadingResponse(false);
    setChatHistory([
      ...remHistory,
      {
        uuid,
        content: sanitizeAssistantOutput(textResponse),
        role: "assistant",
        sources,
        closed: close,
        error,
        animate: !close,
        pending: false,
        chatId,
        metrics,
      },
    ]);
    emitAssistantMessageCompleteEvent(chatId);
  } else if (
    type === "textResponseChunk" ||
    type === "finalizeResponseStream"
  ) {
    if (type === "finalizeResponseStream") {
      setChatHistory((prev) => {
        const chatIdx = prev.findIndex((chat) => chat.uuid === uuid);
        if (chatIdx === -1) return prev;
        
        const updatedHistory = [...prev];
        updatedHistory[chatIdx] = {
          ...updatedHistory[chatIdx],
          closed: close,
          animate: !close,
          pending: false,
          chatId,
          metrics,
        };
        
        // Update prompt with chatId if it exists (previous message)
        if (chatIdx > 0) {
          updatedHistory[chatIdx - 1] = { ...updatedHistory[chatIdx - 1], chatId };
        }
        
        return updatedHistory;
      });
      
      emitAssistantMessageCompleteEvent(chatId);
      setLoadingResponse(false);
    } else {
      setChatHistory((prev) => {
        const chatIdx = prev.findIndex((chat) => chat.uuid === uuid);
        if (chatIdx !== -1) {
          const updatedHistory = [...prev];
          updatedHistory[chatIdx] = {
            ...updatedHistory[chatIdx],
            content: sanitizeAssistantOutput(updatedHistory[chatIdx].content + textResponse),
            ...(sources && sources.length > 0 ? { sources } : {}),
            error,
            closed: close,
            animate: !close,
            pending: false,
            chatId,
            metrics,
          };
          return updatedHistory;
        } else {
          return [
            ...prev,
            {
              uuid,
              sources,
              error,
              content: sanitizeAssistantOutput(textResponse),
              role: "assistant",
              closed: close,
              animate: !close,
              pending: false,
              chatId,
              metrics,
            },
          ];
        }
      });
    }
  } else if (type === "agentInitWebsocketConnection") {
    setWebsocket(chatResult.websocketUUID);
  } else if (type === "stopGeneration") {
    setChatHistory((prev) => {
      const updatedHistory = [...prev];
      const chatIdx = updatedHistory.length - 1;
      if (chatIdx < 0) return prev;
      
      updatedHistory[chatIdx] = {
        ...updatedHistory[chatIdx],
        sources: [],
        closed: true,
        error: null,
        animate: false,
        pending: false,
        metrics,
      };
      return updatedHistory;
    });
    setLoadingResponse(false);
  }

  // Action Handling via special 'action' attribute on response.
  if (action === "reset_chat") setChatHistory([]);

  // If thread was updated automatically based on chat prompt
  // then we can handle the updating of the thread here.
  if (action === "rename_thread") {
    if (!!chatResult?.thread?.slug && chatResult.thread.name) {
      window.dispatchEvent(
        new CustomEvent(THREAD_RENAME_EVENT, {
          detail: {
            threadSlug: chatResult.thread.slug,
            newName: chatResult.thread.name,
          },
        })
      );
    }
  }
}

export function getWorkspaceSystemPrompt(workspace) {
  return (
    workspace?.openAiPrompt ??
    "You are SEETECH AI, a modern industrial engineering copilot. Your role is to provide smart, concise, and professional analysis for plant operations and energy efficiency. \n\n" +
    "PERSONALITY GUIDELINES:\n" +
    "- Be a conversational partner, not a generic support bot.\n" +
    "- Keep responses sharp, confident, and professional.\n" +
    "- Avoid long-winded introductions or repetitive pleasantries.\n" +
    "- Encourage interaction by asking focused follow-up questions when relevant.\n" +
    "- Never reveal internal reasoning, analysis, planning steps, or chain-of-thought.\n" +
    "- Respond only with final user-facing answers."
  );
}

export function chatQueryRefusalResponse(workspace) {
  return (
    workspace?.queryRefusalResponse ??
    "There is no relevant information in this workspace to answer your query."
  );
}
