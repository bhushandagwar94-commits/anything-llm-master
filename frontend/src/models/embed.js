import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Embed = {
  embeds: async () => {
    return await fetch(`${API_BASE}/embeds`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.embeds || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newEmbed: async (data) => {
    return await fetch(`${API_BASE}/embeds/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { embed: null, error: e.message };
      });
  },
  updateEmbed: async (embedId, data) => {
    return await fetch(`${API_BASE}/embed/update/${embedId}`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  deleteEmbed: async (embedId) => {
    return await fetch(`${API_BASE}/embed/${embedId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (res.ok) return { success: true, error: null };
        throw new Error(res.statusText);
      })
      .catch((e) => {
        console.error(e);
        return { success: true, error: e.message };
      });
  },
  chats: async (offset = 0) => {
    return await fetch(`${API_BASE}/embed/chats`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ offset }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  deleteChat: async (chatId) => {
    return await fetch(`${API_BASE}/embed/chats/${chatId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  // Public methods for embed chatting
  streamChat: async (uuid, message, sessionId, attachments = []) => {
    return await fetch(`${API_BASE}/embed/${uuid}/stream-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId, attachments }),
    });
  },
  getHistory: async (uuid, sessionId) => {
    return await fetch(`${API_BASE}/embed/${uuid}/${sessionId}`, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((res) => res?.history || [])
      .catch((e) => {
        console.error("Embed history fetch failed:", e.message);
        return [];
      });
  },
  clearHistory: async (uuid, sessionId) => {
    return await fetch(`${API_BASE}/embed/${uuid}/${sessionId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) return { success: true };
        throw new Error(res.statusText);
      })
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default Embed;
