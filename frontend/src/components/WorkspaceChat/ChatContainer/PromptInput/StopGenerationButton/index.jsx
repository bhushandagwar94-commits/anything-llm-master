import { ABORT_STREAM_EVENT } from "@/utils/chat";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";

export default function StopGenerationButton() {
  const { t } = useTranslation();
  function emitHaltEvent() {
    window.dispatchEvent(new CustomEvent(ABORT_STREAM_EVENT));
  }

  return (
    <>
      <button
        type="button"
        onClick={emitHaltEvent}
        data-tooltip-id="stop-generation-button"
        data-tooltip-content={t("chat_window.stop_generating")}
        className="border-none inline-flex justify-center items-center rounded-xl cursor-pointer w-9 h-9 bg-white/10 light:bg-slate-100 hover:bg-red-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg group"
        aria-label="Stop generating"
      >
        <div className="w-3.5 h-3.5 rounded-[3px] bg-white light:bg-slate-900 group-hover:bg-white" />
      </button>
      <Tooltip
        id="stop-generation-button"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </>
  );
}
