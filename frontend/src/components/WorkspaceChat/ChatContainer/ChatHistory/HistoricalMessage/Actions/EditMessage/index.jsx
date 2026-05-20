import { Info, Pencil } from "@phosphor-icons/react";
import { useRef, useEffect } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";
import {
  useMessageActionsContext,
  EDIT_EVENT,
} from "@/components/WorkspaceChat/ChatContainer/ChatHistory/MessageActionsContext";

export function useEditMessage({ chatId, role }) {
  const context = useMessageActionsContext();
  const isEditing = context?.isEditing(chatId, role) ?? false;
  return { isEditing };
}

export function EditMessageAction({ chatId = null, role, isEditing }) {
  const { t } = useTranslation();
  function handleEditClick() {
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role } })
    );
  }

  if (!chatId || isEditing) return null;
  return (
    <div
      className={`relative ${
        role === "user" && !isEditing ? "" : "!opacity-100"
      }`}
    >
      <button
        onClick={handleEditClick}
        data-tooltip-id="edit-input-text"
        data-tooltip-content={`${
          role === "user"
            ? t("chat_window.edit_prompt")
            : t("chat_window.edit_response")
        } `}
        className="p-1.5 rounded-lg text-white/40 light:text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/5 transition-all duration-200"
        aria-label={`Edit ${role === "user" ? t("chat_window.edit_prompt") : t("chat_window.edit_response")}`}
      >
        <Pencil size={16} />
      </button>
    </div>
  );
}

export function EditMessageForm({
  role,
  chatId,
  message,
  attachments = [],
  adjustTextArea,
  saveChanges,
}) {
  const formRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const editedMessage = formRef.current.value;
    saveChanges({ editedMessage, chatId, role, attachments });
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role, attachments } })
    );
  }

  function handleSave() {
    const editedMessage = formRef.current.value;
    saveChanges({
      editedMessage,
      chatId,
      role,
      attachments,
      saveOnly: true,
    });
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role, attachments } })
    );
  }

  function cancelEdits() {
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role, attachments } })
    );
    return false;
  }

  useEffect(() => {
    if (!formRef?.current) return;
    formRef.current.focus();
    adjustTextArea({ target: formRef.current });
  }, []);

  if (role === "user") {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-[650px]"
      >
        <textarea
          ref={formRef}
          name="editedMessage"
          spellCheck={Appearance.get("enableSpellCheck")}
          className="text-white light:text-slate-900 w-full rounded-2xl bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 focus-glow active:outline-none focus:outline-none outline-none shadow-none focus:ring-0 px-4 py-3 resize-none overflow-hidden transition-all duration-300 leading-relaxed"
          defaultValue={message}
          onChange={adjustTextArea}
        />
        <EditActionBar
          onCancel={cancelEdits}
          onSave={handleSave}
          isUserMessage
        />
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-[650px]"
    >
      <textarea
        ref={formRef}
        name="editedMessage"
        spellCheck={Appearance.get("enableSpellCheck")}
        className="text-white light:text-slate-900 w-full rounded-2xl bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 focus-glow active:outline-none focus:outline-none outline-none shadow-none focus:ring-0 px-4 py-3 resize-none overflow-hidden transition-all duration-300 leading-relaxed"
        defaultValue={message}
        onChange={adjustTextArea}
      />
      <EditActionBar onCancel={cancelEdits} />
    </form>
  );
}

function EditActionBar({ onCancel, onSave, isUserMessage = false }) {
  const { t } = useTranslation();
  return (
    <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 light:bg-black/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 light:border-black/10 shadow-xl">
      <div className="flex items-start gap-3">
        <Info
          size={14}
          className="shrink-0 mt-0.5 text-white/40 light:text-slate-500"
        />
        <span className="text-white/60 light:text-slate-600 text-[11px] leading-relaxed uppercase tracking-wider font-bold">
          {isUserMessage
            ? t("chat_window.edit_info_user")
            : t("chat_window.edit_info_assistant")}
        </span>
      </div>
      <div className="flex items-center gap-2 self-end shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-white/60 light:text-slate-600 text-xs font-bold uppercase tracking-widest hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/5 transition-all duration-200"
        >
          {t("chat_window.cancel")}
        </button>
        {isUserMessage && (
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 rounded-xl border border-white/10 light:border-black/10 text-white/80 light:text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-white/10 light:hover:bg-black/5 transition-all duration-200"
          >
            {t("chat_window.save")}
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isUserMessage ? t("chat_window.submit") : t("chat_window.save")}
        </button>
      </div>
    </div>
  );
}
