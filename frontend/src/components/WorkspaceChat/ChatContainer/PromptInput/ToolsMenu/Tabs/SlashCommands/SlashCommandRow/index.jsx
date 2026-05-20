import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DotsThree } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function SlashCommandRow({
  command,
  description,
  onClick,
  onEdit,
  onPublish,
  showMenu = false,
  highlighted = false,
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 120,
      });
    }
  }, [menuOpen]);

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer group relative transition-colors ${
        highlighted
          ? "bg-zinc-700/50 light:bg-[#EFF6FF] light:border-l-2 light:border-[#2563EB]"
          : "hover:bg-zinc-700/50 light:hover:bg-slate-50"
      }`}
    >
      <div className="flex gap-1.5 items-center text-xs min-w-0 flex-1">
        <span className="text-white light:text-[#1E293B] shrink-0 font-medium">
          {command}
        </span>
        <span className="text-zinc-400 light:text-[#64748B] italic truncate">
          {description}
        </span>
      </div>

      {showMenu && (
        <div className="relative shrink-0 ml-1">
          <button
            ref={menuBtnRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="border-none cursor-pointer text-zinc-400 light:text-[#64748B] p-0.5 hover:text-white light:hover:text-[#0F172A] rounded opacity-0 group-hover:opacity-100 transition-all"
          >
            <DotsThree size={16} weight="bold" />
          </button>

          {menuOpen &&
            createPortal(
              <div
                ref={menuRef}
                style={{
                  position: "fixed",
                  top: menuPosition.top,
                  left: menuPosition.left,
                }}
                className="z-[9999] bg-zinc-800 light:bg-white border border-zinc-700 light:border-slate-300 rounded-lg shadow-lg min-w-[120px] flex flex-col overflow-hidden"
              >
                <button
                  type="button"
                  className="border-none px-3 py-1.5 text-xs text-white light:text-slate-900 hover:bg-zinc-700 light:hover:bg-slate-100 cursor-pointer text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit?.();
                  }}
                >
                  {t("chat_window.edit")}
                </button>
                <button
                  type="button"
                  className="border-none px-3 py-1.5 text-xs text-white light:text-slate-900 hover:bg-zinc-700 light:hover:bg-slate-100 cursor-pointer text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onPublish?.();
                  }}
                >
                  {t("chat_window.publish")}
                </button>
              </div>,
              document.body
            )}
        </div>
      )}
    </div>
  );
}
