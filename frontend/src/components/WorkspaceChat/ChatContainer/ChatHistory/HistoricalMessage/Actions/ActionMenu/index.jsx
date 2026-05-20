import React, { useState, useEffect, useRef } from "react";
import { Trash, DotsThreeVertical, TreeView } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

function ActionMenu({ chatId, forkThread, isEditing, role }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setOpen(!open);

  const handleFork = () => {
    forkThread(chatId);
    setOpen(false);
  };

  const handleDelete = () => {
    window.dispatchEvent(
      new CustomEvent("delete-message", { detail: { chatId } })
    );
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!chatId || isEditing || role === "user") return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-1.5 rounded-lg text-white/40 light:text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/5 transition-all duration-200"
        data-tooltip-id="action-menu"
        data-tooltip-content={t("chat_window.more_actions")}
        aria-label={t("chat_window.more_actions")}
      >
        <DotsThreeVertical size={16} weight="bold" />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-40 rounded-xl bg-[#0f172a]/95 light:bg-white/95 backdrop-blur-2xl p-1.5 flex flex-col shadow-2xl border border-white/10 light:border-black/5 z-50 animate-fadeIn">
          <button
            onClick={handleFork}
            className="flex items-center gap-x-2.5 text-white/70 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/5 py-2 px-3 rounded-lg transition-all duration-200 w-full text-left text-sm font-medium"
          >
            <TreeView size={16} />
            <span>{t("chat_window.fork")}</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-x-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2 px-3 rounded-lg transition-all duration-200 w-full text-left text-sm font-bold"
          >
            <Trash size={16} />
            <span>{t("chat_window.delete")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
