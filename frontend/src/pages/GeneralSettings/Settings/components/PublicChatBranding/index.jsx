import { useEffect, useState, useRef } from "react";
import GlobalConfig from "@/models/config";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { SEETECH_BRANDING_UPDATED } from "@/BrandingContext";

export default function PublicChatBranding() {
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, success, error
  const [settings, setSettings] = useState({
    seetech_chat_heading: "",
    seetech_chat_subtitle: "",
    seetech_chat_suggested_prompts: "",
    seetech_chat_placeholder: "",
    seetech_welcome_message: "",
    seetech_primary_color: "#22C55E",
    seetech_bg_primary: "#0B0F19",
    seetech_typography: "Inter, sans-serif",
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    async function fetchAll() {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        const [configRes, workspacesRes, publicWpRes] = await Promise.all([
          GlobalConfig.get(),
          Workspace.all(),
          GlobalConfig.getPublicWorkspace()
        ]);

      if (configRes && configRes.config) {
        const { config: s } = configRes;
        setSettings({
          seetech_chat_heading: s.seetech_chat_heading || "",
          seetech_chat_subtitle: s.seetech_chat_subtitle || "",
          seetech_chat_suggested_prompts: s.seetech_chat_suggested_prompts || "",
          seetech_chat_placeholder: s.seetech_chat_placeholder || "",
          seetech_welcome_message: s.seetech_welcome_message || "",
          seetech_primary_color: s.seetech_primary_color || "#22C55E",
          seetech_bg_primary: s.seetech_bg_primary || "#0B0F19",
          seetech_typography: s.seetech_typography || "Inter, sans-serif",
        });
      }

      if (workspacesRes) {
        setWorkspaces(workspacesRes);
      }

      if (publicWpRes && publicWpRes.workspace_id) {
        setActiveWorkspaceId(String(publicWpRes.workspace_id));
      }
      } catch (e) {
        console.error("Failed to load branding and routing settings:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveStatus("saving");
    
    try {
      // Update config
      const configResult = await GlobalConfig.update(settings);
      
      // Update active public workspace if selected
      let workspaceResult = { success: true };
      if (activeWorkspaceId) {
        workspaceResult = await GlobalConfig.updatePublicWorkspace(activeWorkspaceId);
      }

      if (configResult.success && workspaceResult.success) {
        showToast("SEETECH branding updated successfully", "success");
        window.dispatchEvent(new CustomEvent(SEETECH_BRANDING_UPDATED));
        window.dispatchEvent(new CustomEvent("BRANDING_UPDATED"));
        setSaveStatus("success");
        setHasChanges(false);
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        showToast(`Failed to update: ${configResult.error || workspaceResult.error}`, "error");
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (e) {
      console.error(e);
      setSaveStatus("error");
      showToast("An unexpected error occurred during save", "error");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  if (loading) return null;

  return (
    <form
      className="flex flex-col gap-y-4 my-4 border-t border-white border-opacity-20 pt-6"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="text-sm leading-6 font-semibold text-white">
          Public Chatbot Branding & Visuals
        </p>
        <p className="text-xs text-white/60">
          Customize the appearance, behavior, and styling of the public SEETECH AI chatbot.
        </p>
      </div>

      <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-2">
        <label className="text-sm font-medium text-white flex items-center gap-x-2">
          Active Public Workspace
          {activeWorkspaceId && (
            <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30">
              Synced & Active
            </span>
          )}
        </label>
        <p className="text-xs text-white/60 mb-3 mt-1">
          Select the centralized workspace that will power the public chatbot's knowledge base.
        </p>
        <select
          value={activeWorkspaceId}
          onChange={(e) => {
            setActiveWorkspaceId(e.target.value);
            setHasChanges(true);
          }}
          className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button outline-none block w-full py-2.5 px-4"
        >
          <option value="" disabled>Select a workspace...</option>
          {workspaces.map((wp) => (
            <option key={wp.id} value={wp.id}>
              {wp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-white">Main Heading</label>
          <input
            name="seetech_chat_heading"
            type="text"
            className="border-none bg-theme-settings-input-bg mt-1 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block w-full py-2 px-4"
            placeholder="SEETECH AI Assistant"
            onChange={handleChange}
            value={settings.seetech_chat_heading}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-white">Subtitle</label>
          <input
            name="seetech_chat_subtitle"
            type="text"
            className="border-none bg-theme-settings-input-bg mt-1 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block w-full py-2 px-4"
            placeholder="Industrial Intelligence for Energy Efficiency"
            onChange={handleChange}
            value={settings.seetech_chat_subtitle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-white">Primary Color (Accent)</label>
          <div className="flex items-center gap-x-2 mt-1">
            <input
              name="seetech_primary_color"
              type="color"
              className="p-1 h-10 w-10 bg-theme-settings-input-bg rounded-lg border-none"
              onChange={handleChange}
              value={settings.seetech_primary_color}
            />
            <input
              name="seetech_primary_color"
              type="text"
              className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button outline-none flex-1 py-2 px-4"
              onChange={handleChange}
              value={settings.seetech_primary_color}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-white">Background Color</label>
          <div className="flex items-center gap-x-2 mt-1">
            <input
              name="seetech_bg_primary"
              type="color"
              className="p-1 h-10 w-10 bg-theme-settings-input-bg rounded-lg border-none"
              onChange={handleChange}
              value={settings.seetech_bg_primary}
            />
            <input
              name="seetech_bg_primary"
              type="text"
              className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button outline-none flex-1 py-2 px-4"
              onChange={handleChange}
              value={settings.seetech_bg_primary}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-white">Typography (Font Family)</label>
          <input
            name="seetech_typography"
            type="text"
            className="border-none bg-theme-settings-input-bg mt-1 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block w-full py-2 px-4"
            placeholder="Inter, sans-serif"
            onChange={handleChange}
            value={settings.seetech_typography}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-white">Welcome Message (Long Text)</label>
        <textarea
          name="seetech_welcome_message"
          className="border-none bg-theme-settings-input-bg mt-1 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block w-full py-2 px-4 h-24"
          placeholder="Hello! I am your SEETECH AI assistant. How can I help you today?"
          onChange={handleChange}
          value={settings.seetech_welcome_message}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white">Suggested Prompts (comma separated)</label>
        <textarea
          name="seetech_chat_suggested_prompts"
          className="border-none bg-theme-settings-input-bg mt-1 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block w-full py-2 px-4 h-20"
          placeholder="Analyze motor efficiency, Calculate ROI, Review audit, Check compliance"
          onChange={handleChange}
          value={settings.seetech_chat_suggested_prompts}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white">Chat Input Placeholder</label>
        <input
          name="seetech_chat_placeholder"
          type="text"
          className="border-none bg-theme-settings-input-bg mt-1 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block w-full py-2 px-4"
          placeholder="Ask about energy efficiency..."
          onChange={handleChange}
          value={settings.seetech_chat_placeholder}
        />
      </div>

      <div className="flex items-center gap-x-4 mt-6 pt-6 border-t border-white/10">
        <button
          type="submit"
          disabled={saveStatus === "saving"}
          className={`
            relative px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
            ${saveStatus === "saving" ? "bg-blue-600/50 cursor-not-allowed opacity-70" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"}
            ${saveStatus === "success" ? "bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.4)]" : ""}
            ${saveStatus === "error" ? "bg-red-600" : ""}
            text-white flex items-center justify-center gap-x-2 min-w-[160px]
          `}
        >
          {saveStatus === "saving" && (
            <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
          )}
          <span>
            {saveStatus === "idle" && "Save Changes"}
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "success" && "Saved Successfully"}
            {saveStatus === "error" && "Failed to Save"}
          </span>
        </button>
        
        {hasChanges && saveStatus === "idle" && (
          <p className="text-xs text-blue-400 font-medium animate-pulse">
            You have unsaved changes
          </p>
        )}
      </div>
    </form>
  );
}
