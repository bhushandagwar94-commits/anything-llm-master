import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const GlobalConfig = {
  get: async () => {
    return await fetch(`${API_BASE}/config`, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .catch((e) => {
        console.error("Config fetch failed:", e.message);
        return { config: null };
      });
  },
  update: async (updates) => {
    return await fetch(`${API_BASE}/config`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  getPublicWorkspace: async () => {
    return await fetch(`${API_BASE}/public-workspace`, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Failed to fetch public workspace");
        }
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error("Invalid configuration response from server");
        }
      })
      .catch((e) => {
        console.error("[CONFIG ERROR] Public workspace fetch failed:", e.message);
        return { embed_uuid: null, workspace_id: null, workspace: null };
      });
  },
  updatePublicWorkspace: async (workspaceId) => {
    return await fetch(`${API_BASE}/public-workspace`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ workspaceId }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  }
};

export default GlobalConfig;
