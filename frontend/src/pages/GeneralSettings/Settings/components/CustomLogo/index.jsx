import useLogo from "@/hooks/useLogo";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useRef, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function CustomLogo() {
  const { t } = useTranslation();
  const { logo: _initLogo, setLogo: _setLogo } = useLogo();
  const [logo, setLogo] = useState("");
  const [isDefaultLogo, setIsDefaultLogo] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function logoInit() {
      setLogo(_initLogo || "");
      const _isDefaultLogo = await System.isDefaultLogo();
      setIsDefaultLogo(_isDefaultLogo);
    }
    logoInit();
  }, [_initLogo]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const objectURL = URL.createObjectURL(file);
    setLogo(objectURL);

    const formData = new FormData();
    formData.append("logo", file);
    const { success, error } = await System.uploadLogo(formData);
    if (!success) {
      showToast(`Failed to upload logo: ${error}`, "error");
      setLogo(_initLogo);
      return;
    }

    const { logoURL } = await System.fetchLogo();
    _setLogo(logoURL);

    showToast("Image uploaded successfully.", "success");
    setIsDefaultLogo(false);
  };

  const handleRemoveLogo = async () => {
    setLogo("");
    setIsDefaultLogo(true);

    const { success, error } = await System.removeCustomLogo();
    if (!success) {
      console.error("Failed to remove logo:", error);
      showToast(`Failed to remove logo: ${error}`, "error");
      const { logoURL } = await System.fetchLogo();
      setLogo(logoURL);
      setIsDefaultLogo(false);
      return;
    }

    const { logoURL } = await System.fetchLogo();
    _setLogo(logoURL);

    showToast("Image successfully removed.", "success");
  };

  const triggerFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-y-3 p-6 bg-white/5 light:bg-white rounded-2xl border border-white/10 light:border-slate-200 shadow-lg mb-6 font-sans">
      <div>
        <p className="text-base leading-6 font-bold text-white light:text-slate-900 tracking-tight">
          {t("customization.items.logo.title")} (Whitelabel Brand Logo)
        </p>
        <p className="text-xs text-white/60 light:text-slate-500 mt-0.5 leading-relaxed">
          {t("customization.items.logo.description")}
        </p>
      </div>
      {isDefaultLogo ? (
        <div className="flex md:flex-row flex-col items-center mt-1">
          <div className="flex flex-row gap-x-8 w-full md:w-auto">
            <label
              className="transition-all duration-300 hover:opacity-80 w-full md:w-80"
              hidden={!isDefaultLogo}
            >
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div
                className="w-full md:w-80 py-8 bg-theme-settings-input-bg rounded-2xl border-2 border-dashed border-white/20 light:border-slate-300 hover:border-cyan-500 light:hover:border-blue-500 justify-center items-center inline-flex cursor-pointer transition-colors shadow-inner"
                htmlFor="logo-upload"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-cyan-500/10 light:bg-blue-50 p-3 mb-2 border border-cyan-500/20 light:border-blue-100">
                    <Plus className="w-6 h-6 text-cyan-400 light:text-blue-600" />
                  </div>
                  <div className="text-white light:text-slate-900 text-sm font-bold py-1">
                    {t("customization.items.logo.add")}
                  </div>
                  <div className="text-white/50 light:text-slate-400 text-xs font-medium py-0.5">
                    {t("customization.items.logo.recommended")}
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      ) : (
        <div className="flex md:flex-row flex-col items-center relative mt-1">
          <div className="group w-full md:w-80 h-[140px] overflow-hidden rounded-2xl border border-white/20 light:border-slate-200 shadow-inner bg-theme-settings-input-bg relative flex items-center justify-center p-2">
            <img
              src={logo}
              alt="Uploaded Logo"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

            <div className="absolute inset-0 flex flex-col gap-y-2 justify-center items-center bg-slate-950/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
              <button
                onClick={triggerFileInputClick}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 light:bg-blue-600 light:hover:bg-blue-700 text-slate-950 light:text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                {t("customization.items.logo.replace")}
              </button>

              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <button
                onClick={handleRemoveLogo}
                className="px-5 py-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white/80 font-bold text-xs rounded-xl border border-white/10 hover:border-red-500/30 transition-all"
              >
                {t("customization.items.logo.remove")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
