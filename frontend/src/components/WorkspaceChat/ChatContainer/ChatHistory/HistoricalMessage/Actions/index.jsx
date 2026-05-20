import React, { memo, useState } from "react";
import useCopyText from "@/hooks/useCopyText";
import { Check, ThumbsUp, ArrowsClockwise, Copy } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import { EditMessageAction } from "./EditMessage";
import RenderMetrics from "./RenderMetrics";
import ActionMenu from "./ActionMenu";
import { useTranslation } from "react-i18next";
import useUser from "@/hooks/useUser";

const Actions = ({
  message,
  feedbackScore,
  chatId,
  slug,
  isLastMessage,
  regenerateMessage,
  forkThread,
  isEditing,
  role,
  metrics = {},
}) => {
  const { user } = useUser();
  const isAdmin = user?.role === "admin" || user === null;
  const { t } = useTranslation();

  const isPublic = window.location.pathname === "/";
  if (!isAdmin || isPublic) return null;
  const [selectedFeedback, setSelectedFeedback] = useState(feedbackScore);
  const handleFeedback = async (newFeedback) => {
    const updatedFeedback =
      selectedFeedback === newFeedback ? null : newFeedback;
    await Workspace.updateChatFeedback(chatId, slug, updatedFeedback);
    setSelectedFeedback(updatedFeedback);
  };

  return (
    <div
      className={`flex w-full flex-wrap items-center gap-y-1 ${role === "user" ? "justify-end" : "justify-between"}`}
    >
      <div className="flex justify-start items-center gap-x-[8px]">
        <div className="md:group-hover:opacity-100 transition-all duration-300 md:opacity-0 flex justify-start items-center gap-x-[8px]">
          <div
            className={`flex justify-start items-center gap-x-[8px] ${role === "user" ? "flex-row-reverse" : ""}`}
          >
            <CopyMessage message={message} />
            <EditMessageAction
              chatId={chatId}
              role={role}
              isEditing={isEditing}
            />
          </div>
          {isLastMessage && !isEditing && (
            <RegenerateMessage
              regenerateMessage={regenerateMessage}
              slug={slug}
              chatId={chatId}
            />
          )}
          {chatId && role !== "user" && !isEditing && (
            <FeedbackButton
              isSelected={selectedFeedback === true}
              handleFeedback={() => handleFeedback(true)}
              tooltipId="feedback-button"
              tooltipContent={t("chat_window.good_response")}
              IconComponent={ThumbsUp}
            />
          )}
          <ActionMenu
            chatId={chatId}
            forkThread={forkThread}
            isEditing={isEditing}
            role={role}
          />
        </div>
      </div>
      <RenderMetrics metrics={metrics} />
    </div>
  );
};

function FeedbackButton({
  isSelected,
  handleFeedback,
  tooltipContent,
  IconComponent,
}) {
  return (
    <div className="relative">
      <button
        onClick={handleFeedback}
        data-tooltip-id="feedback-button"
        data-tooltip-content={tooltipContent}
        className={`p-1.5 rounded-lg transition-all duration-200 ${
          isSelected
            ? "text-green-400 bg-green-500/10"
            : "text-white/40 light:text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/5"
        }`}
        aria-label={tooltipContent}
      >
        <IconComponent
          size={16}
          weight={isSelected ? "fill" : "regular"}
        />
      </button>
    </div>
  );
}

function CopyMessage({ message }) {
  const { copied, copyText } = useCopyText();
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        onClick={() => copyText(message)}
        data-tooltip-id="copy-assistant-text"
        data-tooltip-content={t("chat_window.copy")}
        className="p-1.5 rounded-lg text-white/40 light:text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/5 transition-all duration-200"
        aria-label={t("chat_window.copy")}
      >
        {copied ? (
          <Check size={16} />
        ) : (
          <Copy size={16} />
        )}
      </button>
    </div>
  );
}

function RegenerateMessage({ regenerateMessage, chatId }) {
  const { t } = useTranslation();
  if (!chatId) return null;
  return (
    <div className="relative">
      <button
        onClick={() => regenerateMessage(chatId)}
        data-tooltip-id="regenerate-assistant-text"
        data-tooltip-content={t("chat_window.regenerate_response")}
        className="p-1.5 rounded-lg text-white/40 light:text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/5 transition-all duration-200"
        aria-label={t("chat_window.regenerate")}
      >
        <ArrowsClockwise size={16} weight="bold" />
      </button>
    </div>
  );
}

export default memo(Actions);
