import React, { memo, useMemo } from "react";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import { parseAIResponse } from "@/utils/ai/responseParser";
import AIBlockRenderer from "@/components/AIBlocks";

const HistoricalMessage = ({ message, role, workspace, sources = [], feedbackScore, chatId, error, attachments = [], regenerateMessage, isLastMessage, saveEditedMessage, forkThread, metrics, outputs }) => {
  const isUser = role === "user";
  const rawText = typeof message === "string" ? message : message?.content || "";

  const { markdownParts, blocks } = useMemo(
    () => parseAIResponse(rawText),
    [rawText]
  );

  return (
    <div className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[85%]" ${
          isUser
            ? "user-message-gradient rounded-2xl rounded-tr-sm px-4 py-3 text-white shadow-xl border border-white/10"
            : "assistant-message-container w-full"
        }`}
        style={isUser ? {
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(34, 197, 94, 0.1))",
          backdropFilter: "blur(12px)",
        } : {}}
      >
        {/* Animated Border for user messages */}
        {isUser && (
          <div className="absolute inset-0 rounded-2xl rounded-tr-sm pointer-events-none border-glow-animate" />
        )}

        <div className="flex flex-col gap-y-3">
          {markdownParts.map((part, index) => (
            <div
              key={index}
              className="markdown break-words leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkdown(part)),
              }}
            />
          ))}
          
          {blocks.length > 0 && <AIBlockRenderer blocks={blocks} />}
        </div>
      </div>
    </div>
  );
};

export default memo(HistoricalMessage);
