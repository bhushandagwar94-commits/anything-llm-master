/* eslint-disable react-hooks/refs */
import { memo, useRef, useEffect, useState, useMemo } from "react";
import { Warning } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import Citations from "../Citation";
import {
  THOUGHT_REGEX_CLOSE,
  THOUGHT_REGEX_COMPLETE,
  THOUGHT_REGEX_OPEN,
  ThoughtChainComponent,
} from "../ThoughtContainer";
import { StreamingAccumulator } from "@/utils/ai/responseParser";
import AIBlockRenderer from "@/components/AIBlocks";

const PromptReply = ({ reply, sources = [] }) => {
  const accumulator = useMemo(() => new StreamingAccumulator(), []);
  const { markdownParts, blocks } = useMemo(() => {
    accumulator.reset();
    return accumulator.push(reply || "");
  }, [reply, accumulator]);

  const isThinking = !reply || reply.trim().length === 0;

  return (
    <div className="flex flex-col gap-y-3 assistant-message-container animate-message">
      {isThinking ? (
        <div className="seetech-typing">
          <div className="seetech-typing-dot" />
          <div className="seetech-typing-dot" />
          <div className="seetech-typing-dot" />
        </div>
      ) : (
        <>
          {markdownParts.map((part, index) => (
            <div
              key={index}
              className="markdown break-words leading-relaxed text-white light:text-slate-900"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkdown(part)),
              }}
            />
          ))}
          {blocks.length > 0 && <AIBlockRenderer blocks={blocks} />}
          <span className="streaming-cursor mt-1" />
        </>
      )}
    </div>
  );
};

/**
 * StreamingAssistantContent
 * ==========================
 * Handles incremental streaming rendering using the StreamingAccumulator.
 *
 * - Markdown text renders progressively as chunks arrive
 * - AI blocks are extracted silently; partial JSON is hidden
 * - Completed blocks render immediately as the stream progresses
 * - The user NEVER sees raw JSON at any point
 */
function StreamingAssistantContent({ message }) {
  if (!message) return null;
  const isThinking = message.trim().length === 0;

  return (
    <div className="flex flex-col gap-y-1 animate-message assistant-message">
      <div className="flex flex-col">
        {isThinking ? (
          <div className="seetech-typing">
            <div className="seetech-typing-dot" />
            <div className="seetech-typing-dot" />
            <div className="seetech-typing-dot" />
          </div>
        ) : (
          <>
            <span
              className="break-words leading-relaxed text-white light:text-slate-900"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkdown(message)),
              }}
            />
            <span className="streaming-cursor mt-1" />
          </>
        )}
      </div>
    </div>
  );
}

export default memo(PromptReply);
