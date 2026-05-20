import { useEffect, useState } from "react";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function CustomSiteSettings() {
  const { t } = useTranslation();
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({
    title: null,
    faviconUrl: null,
  });

  useEffect(() => {
    Admin.systemPreferencesByFields([
      "meta_page_title",
      "meta_page_favicon",
    ]).then(({ settings }) => {
      setSettings({
        title: settings?.meta_page_title,
        faviconUrl: settings?.meta_page_favicon,
      });
    });
  }, []);

  async function handleSiteSettingUpdate(e) {
    e.preventDefault();
    await Admin.updateSystemPreferences({
      meta_page_title: settings.title ?? null,
      meta_page_favicon: settings.faviconUrl ?? null,
    });
    showToast(
      "Site preferences updated! They will reflect on page reload.",
      "success",
      { clear: true }
    );
    setHasChanges(false);
    return;
  }

  return (
    <form
      className="flex flex-col gap-y-6 p-6 bg-white/5 light:bg-white rounded-2xl border border-white/10 light:border-slate-200 shadow-lg mb-6 font-sans"
      onChange={() => setHasChanges(true)}
      onSubmit={handleSiteSettingUpdate}
    >
      <div>
        <p className="text-base leading-6 font-bold text-white light:text-slate-900 tracking-tight">
          {t("customization.items.browser-appearance.title")} (Browser Tab & Favicon)
        </p>
        <p className="text-xs text-white/60 light:text-slate-500 mt-0.5 leading-relaxed">
          {t("customization.items.browser-appearance.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-white light:text-slate-800 block mb-1.5">
            {t("customization.items.browser-appearance.tab.title")}
          </label>
          <p className="text-xs text-white/50 light:text-slate-500 mb-3">
            {t("customization.items.browser-appearance.tab.description")}
          </p>
          <input
            name="meta_page_title"
            type="text"
            className="border-none bg-theme-settings-input-bg text-white text-sm rounded-xl focus:outline-primary-button active:outline-primary-button outline-none block w-full py-2.5 px-4 shadow-inner"
            placeholder="AnythingLLM | Your personal LLM trained on anything"
            autoComplete="off"
            onChange={(e) => {
              setSettings((prev) => ({ ...prev, title: e.target.value }));
            }}
            value={
              settings.title ??
              "AnythingLLM | Your personal LLM trained on anything"
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white light:text-slate-800 block mb-1.5">
            {t("customization.items.browser-appearance.favicon.title")}
          </label>
          <p className="text-xs text-white/50 light:text-slate-500 mb-3">
            {t("customization.items.browser-appearance.favicon.description")}
          </p>
          <div className="flex items-center gap-x-3">
            <img
              src={settings.faviconUrl ?? "/favicon.png"}
              onError={(e) => (e.target.src = "/favicon.png")}
              className="h-11 w-11 rounded-xl object-cover bg-white/10 p-1 border border-white/20 shadow-inner shrink-0"
              alt="Site favicon"
            />
            <input
              name="meta_page_favicon"
              type="url"
              className="border-none bg-theme-settings-input-bg text-white text-sm rounded-xl focus:outline-primary-button active:outline-primary-button outline-none block w-full py-2.5 px-4 shadow-inner"
              placeholder="url to your image"
              onChange={(e) => {
                setSettings((prev) => ({ ...prev, faviconUrl: e.target.value }));
              }}
              autoComplete="off"
              value={settings.faviconUrl ?? ""}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-white/10 light:border-slate-100 mt-2">
        <button
          type="submit"
          disabled={!hasChanges}
          className={`transition-all duration-300 px-6 py-2.5 rounded-xl font-bold text-sm items-center flex gap-x-2 shadow-lg
            ${hasChanges ? "bg-cyan-500 hover:bg-cyan-400 light:bg-blue-600 light:hover:bg-blue-700 text-slate-950 light:text-white hover:-translate-y-0.5 shadow-cyan-500/25 light:shadow-blue-500/25" : "bg-white/10 light:bg-slate-100 text-white/40 light:text-slate-400 cursor-not-allowed"}
          `}
        >
          Save Site Settings
        </button>
      </div>
    </form>
  );
}
