import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CustomAppName() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [customAppName, setCustomAppName] = useState("");
  const [originalAppName, setOriginalAppName] = useState("");

  useEffect(() => {
    const fetchInitialParams = async () => {
      const { appName } = await System.fetchCustomAppName();
      setCustomAppName(appName || "");
      setOriginalAppName(appName || "");
      setLoading(false);
    };
    fetchInitialParams();
  }, []);

  const updateCustomAppName = async (e, newValue = null) => {
    e.preventDefault();
    let custom_app_name = newValue;
    if (newValue === null) {
      const form = new FormData(e.target);
      custom_app_name = form.get("customAppName");
    }
    const { success, error } = await Admin.updateSystemPreferences({
      custom_app_name,
    });
    if (!success) {
      showToast(`Failed to update custom app name: ${error}`, "error");
      return;
    } else {
      showToast("Successfully updated custom app name.", "success");
      window.localStorage.removeItem(System.cacheKeys.customAppName);
      setCustomAppName(custom_app_name);
      setOriginalAppName(custom_app_name);
      setHasChanges(false);
    }
  };

  const handleChange = (e) => {
    setCustomAppName(e.target.value);
    setHasChanges(true);
  };

  if (loading) return null;

  return (
    <form
      className="flex flex-col gap-y-3 p-6 bg-white/5 light:bg-white rounded-2xl border border-white/10 light:border-slate-200 shadow-lg mb-6 font-sans"
      onSubmit={updateCustomAppName}
    >
      <div>
        <p className="text-base leading-6 font-bold text-white light:text-slate-900 tracking-tight">
          {t("customization.items.app-name.title")} (Whitelabel App Name)
        </p>
        <p className="text-xs text-white/60 light:text-slate-500 mt-0.5 leading-relaxed">
          {t("customization.items.app-name.description")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-1">
        <input
          name="customAppName"
          type="text"
          className="border-none bg-theme-settings-input-bg text-white text-sm rounded-xl focus:outline-primary-button active:outline-primary-button outline-none block w-full md:w-80 py-2.5 px-4 shadow-inner"
          placeholder="e.g. SEETECH Enterprise AI"
          required={true}
          autoComplete="off"
          onChange={handleChange}
          value={customAppName}
        />
        <div className="flex items-center gap-2">
          {originalAppName !== "" && (
            <button
              type="button"
              onClick={(e) => updateCustomAppName(e, "")}
              className="px-4 py-2.5 rounded-xl bg-white/5 light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 text-white/70 light:text-slate-600 text-sm font-medium transition-colors"
            >
              Reset Default
            </button>
          )}
          <button
            type="submit"
            disabled={!hasChanges}
            className={`transition-all duration-300 px-6 py-2.5 rounded-xl font-bold text-sm items-center flex gap-x-2 shadow-lg
              ${hasChanges ? "bg-cyan-500 hover:bg-cyan-400 light:bg-blue-600 light:hover:bg-blue-700 text-slate-950 light:text-white hover:-translate-y-0.5 shadow-cyan-500/25 light:shadow-blue-500/25" : "bg-white/10 light:bg-slate-100 text-white/40 light:text-slate-400 cursor-not-allowed"}
            `}
          >
            Save App Name
          </button>
        </div>
      </div>
    </form>
  );
}
