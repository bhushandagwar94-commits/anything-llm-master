import React, { useState, useEffect } from "react";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";
import NewIconForm from "./NewIconForm";
import Admin from "@/models/admin";
import System from "@/models/system";
import { useTranslation } from "react-i18next";

export default function FooterCustomization() {
  const [footerIcons, setFooterIcons] = useState(Array(3).fill(null));
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchFooterIcons() {
      const { settings } = await Admin.systemPreferencesByFields([
        "footer_data",
      ]);

      const footerData = settings?.footer_data;
      if (footerData) {
        const parsedIcons = safeJsonParse(footerData, []);
        setFooterIcons((prevIcons) => {
          const updatedIcons = [...prevIcons];
          parsedIcons.forEach((icon, index) => {
            updatedIcons[index] = icon;
          });
          return updatedIcons;
        });
      }
    }
    fetchFooterIcons();
  }, []);

  const updateFooterIcons = async (updatedIcons) => {
    const { success, error } = await Admin.updateSystemPreferences({
      footer_data: JSON.stringify(updatedIcons.filter((icon) => icon !== null)),
    });

    if (!success) {
      showToast(`Failed to update footer icons - ${error}`, "error", {
        clear: true,
      });
      return;
    }

    window.localStorage.removeItem(System.cacheKeys.footerIcons);
    setFooterIcons(updatedIcons);
    showToast("Successfully updated footer icons.", "success", { clear: true });
  };

  const handleRemoveIcon = (index) => {
    const updatedIcons = [...footerIcons];
    updatedIcons[index] = null;
    updateFooterIcons(updatedIcons);
  };

  return (
    <div className="flex flex-col gap-y-3 p-6 bg-white/5 light:bg-white rounded-2xl border border-white/10 light:border-slate-200 shadow-lg mb-6 font-sans">
      <div>
        <p className="text-base leading-6 font-bold text-white light:text-slate-900 tracking-tight">
          {t("customization.items.sidebar-footer.title")} (Sidebar Footer Links)
        </p>
        <p className="text-xs text-white/60 light:text-slate-500 mt-0.5 leading-relaxed">
          {t("customization.items.sidebar-footer.description")}
        </p>
      </div>
      <div className="mt-2 flex gap-x-3 font-bold text-white/80 light:text-slate-700 text-xs uppercase tracking-wider border-b border-white/10 light:border-slate-100 pb-2">
        <div className="w-12">{t("customization.items.sidebar-footer.icon")}</div>
        <div className="flex-1">{t("customization.items.sidebar-footer.link")}</div>
      </div>
      <div className="mt-1 flex flex-col gap-y-3">
        {footerIcons.map((icon, index) => (
          <NewIconForm
            key={index}
            icon={icon?.icon}
            url={icon?.url}
            onSave={(newIcon, newUrl) => {
              const updatedIcons = [...footerIcons];
              updatedIcons[index] = { icon: newIcon, url: newUrl };
              updateFooterIcons(updatedIcons);
            }}
            onRemove={() => handleRemoveIcon(index)}
          />
        ))}
      </div>
    </div>
  );
}
