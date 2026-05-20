import { ChartLineUp, Wind, ShieldCheck, Gear } from "@phosphor-icons/react";

const ICONS = [ChartLineUp, Wind, ShieldCheck, Gear];

export default function SuggestedMessages({
  suggestedMessages = [],
  sendCommand,
}) {
  if (!suggestedMessages?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[850px] mt-8 px-6 animate-fadeIn">
      {suggestedMessages.map((msg, index) => {
        const Icon = ICONS[index % ICONS.length];
        const heading = msg.heading || "Task";
        const message = msg.message || "";
        const fullText = heading?.trim() ? `${heading} ${message}` : message;

        return (
          <button
            key={index}
            type="button"
            onClick={() => sendCommand({ text: fullText, autoSubmit: true })}
            className="flex flex-col items-start p-5 rounded-2xl bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 hover:border-green-500/50 hover:bg-white/[0.08] light:hover:bg-black/[0.08] transition-all duration-300 group text-left shadow-lg hover:shadow-green-500/10 hover:-translate-y-1 backdrop-blur-md"
          >
            <div className="p-2.5 rounded-xl bg-white/5 light:bg-black/5 mb-4 group-hover:bg-green-500/10 transition-colors">
              <Icon size={20} className="text-white/40 light:text-slate-500 group-hover:text-green-500 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-white light:text-slate-900 mb-1.5 uppercase tracking-widest">{heading}</h3>
            <p className="text-sm text-white/40 light:text-slate-500 leading-relaxed group-hover:text-white/60 light:group-hover:text-slate-700 transition-colors">
              {message}
            </p>
          </button>
        );
      })}
    </div>
  );
}
