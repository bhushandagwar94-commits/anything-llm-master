import { API_BASE } from "./constants";

function applyOptions(path, options = {}) {
  let updatedPath = path;
  if (!options || Object.keys(options).length === 0) return updatedPath;

  if (options.search) {
    const searchParams = new URLSearchParams(options.search);
    updatedPath += `?${searchParams.toString()}`;
  }
  return updatedPath;
}

export default {
  home: () => {
    return "/";
  },
  admin: () => {
    return "/admin";
  },
  login: (noTry = false) => {
    return `/admin/login${noTry ? "?nt=1" : ""}`;
  },
  sso: {
    login: () => {
      return "/admin/sso/simple";
    },
  },
  onboarding: {
    home: () => {
      return "/admin/onboarding";
    },
    survey: () => {
      return "/admin/onboarding/survey";
    },
    llmPreference: () => {
      return "/admin/onboarding/llm-preference";
    },
    embeddingPreference: () => {
      return "/admin/onboarding/embedding-preference";
    },
    vectorDatabase: () => {
      return "/admin/onboarding/vector-database";
    },
    userSetup: () => {
      return "/admin/onboarding/user-setup";
    },
    dataHandling: () => {
      return "/admin/onboarding/data-handling";
    },
  },
  github: () => {
    return "https://github.com/Mintplex-Labs/anything-llm";
  },
  discord: () => {
    return "https://discord.com/invite/6UyHPeGZAC";
  },
  docs: (path = "") => {
    return `https://docs.anythingllm.com${path}`;
  },
  chatModes: () => {
    return "https://docs.anythingllm.com/features/chat-modes";
  },
  mailToMintplex: () => {
    return "mailto:team@mintplexlabs.com";
  },
  hosting: () => {
    return "https://my.mintplexlabs.com/aio-checkout?product=anythingllm";
  },
  workspace: {
    chat: (slug, options = {}) => {
      return applyOptions(`/admin/workspace/${slug}`, options);
    },
    settings: {
      generalAppearance: (slug) => {
        return `/admin/workspace/${slug}/settings/general-appearance`;
      },
      chatSettings: function (slug, options = {}) {
        return applyOptions(
          `/admin/workspace/${slug}/settings/chat-settings`,
          options
        );
      },
      vectorDatabase: (slug) => {
        return `/admin/workspace/${slug}/settings/vector-database`;
      },
      members: (slug) => {
        return `/admin/workspace/${slug}/settings/members`;
      },
      agentConfig: (slug) => {
        return `/admin/workspace/${slug}/settings/agent-config`;
      },
    },
    thread: (wsSlug, threadSlug) => {
      return `/admin/workspace/${wsSlug}/t/${threadSlug}`;
    },
  },
  apiDocs: () => {
    return `${API_BASE}/docs`;
  },
  settings: {
    users: () => {
      return `/admin/settings/users`;
    },
    invites: () => {
      return `/admin/settings/invites`;
    },
    workspaces: () => {
      return `/admin/settings/workspaces`;
    },
    chats: () => {
      return "/admin/settings/workspace-chats";
    },
    llmPreference: () => {
      return "/admin/settings/llm-preference";
    },
    transcriptionPreference: () => {
      return "/admin/settings/transcription-preference";
    },
    audioPreference: () => {
      return "/admin/settings/audio-preference";
    },
    defaultSystemPrompt: () => {
      return "/admin/settings/default-system-prompt";
    },
    embedder: {
      modelPreference: () => "/admin/settings/embedding-preference",
      chunkingPreference: () => "/admin/settings/text-splitter-preference",
    },
    embeddingPreference: () => {
      return "/admin/settings/embedding-preference";
    },
    vectorDatabase: () => {
      return "/admin/settings/vector-database";
    },
    security: () => {
      return "/admin/settings/security";
    },
    interface: () => {
      return "/admin/settings/interface";
    },
    branding: () => {
      return "/admin/settings/branding";
    },
    agentSkills: () => {
      return "/admin/settings/agents";
    },
    chat: () => {
      return "/admin/settings/chat";
    },
    apiKeys: () => {
      return "/admin/settings/api-keys";
    },
    systemPromptVariables: () => "/admin/settings/system-prompt-variables",
    logs: () => {
      return "/admin/settings/event-logs";
    },
    privacy: () => {
      return "/admin/settings/privacy";
    },
    embedChatWidgets: () => {
      return `/admin/settings/embed-chat-widgets`;
    },
    browserExtension: () => {
      return `/admin/settings/browser-extension`;
    },
    mobile: () => {
      return `/admin/settings/mobile-connections`;
    },
    experimental: () => {
      return `/admin/settings/beta-features`;
    },
    mobileConnections: () => {
      return `/admin/settings/mobile-connections`;
    },
    telegram: () => {
      return `/admin/settings/external-connections/telegram`;
    },
    scheduledJobs: () => {
      return `/admin/settings/scheduled-jobs`;
    },
    scheduledJobRuns: (jobId) => {
      return `/admin/settings/scheduled-jobs/${jobId}/runs`;
    },
    scheduledJobRunDetail: (jobId, runId) => {
      return `/admin/settings/scheduled-jobs/${jobId}/runs/${runId}`;
    },
  },
  agents: {
    builder: () => {
      return `/admin/settings/agents/builder`;
    },
    editAgent: (uuid) => {
      return `/admin/settings/agents/builder/${uuid}`;
    },
  },
  communityHub: {
    website: () => {
      return import.meta.env.DEV
        ? `http://localhost:5173`
        : `https://hub.anythingllm.com`;
    },
    /**
     * View more items of a given type on the community hub.
     * @param {string} type - The type of items to view more of. Should be kebab-case.
     * @returns {string} The path to view more items of the given type.
     */
    viewMoreOfType: function (type) {
      return `${this.website()}/list/${type}`;
    },
    viewItem: function (type, id) {
      return `${this.website()}/i/${type}/${id}`;
    },
    trending: () => {
      return `/admin/settings/community-hub/trending`;
    },
    authentication: () => {
      return `/admin/settings/community-hub/authentication`;
    },
    importItem: (importItemId) => {
      return `/admin/settings/community-hub/import-item${importItemId ? `?id=${importItemId}` : ""}`;
    },
    profile: function (username) {
      if (username) return `${this.website()}/u/${username}`;
      return `${this.website()}/me`;
    },
    noPrivateItems: () => {
      return "https://docs.anythingllm.com/community-hub/faq#no-private-items";
    },
  },

  // TODO: Migrate all docs.anythingllm.com links to the new docs.
  documentation: {
    mobileIntroduction: () => {
      return "https://docs.anythingllm.com/mobile/overview";
    },
    contextWindows: () => {
      return "https://docs.anythingllm.com/chatting-with-documents/introduction#you-exceed-the-context-window---what-now";
    },
  },

  experimental: {
    liveDocumentSync: {
      manage: () => `/admin/settings/beta-features/live-document-sync/manage`,
    },
  },
};

