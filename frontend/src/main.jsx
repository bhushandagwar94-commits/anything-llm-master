import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "@/App.jsx";
import PrivateRoute, {
  AdminRoute,
  ManagerRoute,
  SingleUserRoute,
} from "@/components/PrivateRoute";
import Login from "@/pages/Login";
import SimpleSSOPassthrough from "@/pages/Login/SSO/simple";
import OnboardingFlow from "@/pages/OnboardingFlow";
import PublicChat from "@/pages/PublicChat";
import "@/index.css";

const isDev = import.meta.env.DEV;
const REACTWRAP = isDev ? React.Fragment : React.StrictMode;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <PublicChat />,
      },
      {
        path: "/admin",
        children: [
          {
            path: "/admin",
            lazy: async () => {
              const { default: Main } = await import("@/pages/Main");
              return { element: <PrivateRoute Component={Main} /> };
            },
          },
          {
            path: "/admin/login",
            element: <Login />,
          },
          {
            path: "/admin/sso/simple",
            element: <SimpleSSOPassthrough />,
          },
          {
            path: "/admin/onboarding",
            element: <OnboardingFlow />,
          },
          {
            path: "/admin/onboarding/:step",
            element: <OnboardingFlow />,
          },
          {
            path: "/admin/accept-invite/:code",
            lazy: async () => {
              const { default: InvitePage } = await import("@/pages/Invite");
              return { element: <InvitePage /> };
            },
          },
          {
            path: "/admin/workspace/:slug/settings/:tab",
            lazy: async () => {
              const { default: WorkspaceSettings } = await import(
                "@/pages/WorkspaceSettings"
              );
              return { element: <ManagerRoute Component={WorkspaceSettings} /> };
            },
          },
          {
            path: "/admin/workspace/:slug",
            lazy: async () => {
              const { default: WorkspaceChat } = await import(
                "@/pages/WorkspaceChat"
              );
              return { element: <PrivateRoute Component={WorkspaceChat} /> };
            },
            children: [
              {
                path: "t/:threadSlug",
                lazy: async () => {
                  const { default: WorkspaceChat } = await import(
                    "@/pages/WorkspaceChat"
                  );
                  return { element: <PrivateRoute Component={WorkspaceChat} /> };
                },
              },
            ],
          },
          {
            path: "/admin/settings/llm-preference",
            lazy: async () => {
              const { default: GeneralLLMPreference } = await import(
                "@/pages/GeneralSettings/LLMPreference"
              );
              return { element: <AdminRoute Component={GeneralLLMPreference} /> };
            },
          },
          {
            path: "/admin/settings/transcription-preference",
            lazy: async () => {
              const { default: GeneralTranscriptionPreference } = await import(
                "@/pages/GeneralSettings/TranscriptionPreference"
              );
              return {
                element: <AdminRoute Component={GeneralTranscriptionPreference} />,
              };
            },
          },
          {
            path: "/admin/settings/audio-preference",
            lazy: async () => {
              const { default: GeneralAudioPreference } = await import(
                "@/pages/GeneralSettings/AudioPreference"
              );
              return {
                element: <AdminRoute Component={GeneralAudioPreference} />,
              };
            },
          },
          {
            path: "/admin/settings/embedding-preference",
            lazy: async () => {
              const { default: GeneralEmbeddingPreference } = await import(
                "@/pages/GeneralSettings/EmbeddingPreference"
              );
              return {
                element: <AdminRoute Component={GeneralEmbeddingPreference} />,
              };
            },
          },
          {
            path: "/admin/settings/text-splitter-preference",
            lazy: async () => {
              const { default: EmbeddingTextSplitterPreference } = await import(
                "@/pages/GeneralSettings/EmbeddingTextSplitterPreference"
              );
              return {
                element: <AdminRoute Component={EmbeddingTextSplitterPreference} />,
              };
            },
          },
          {
            path: "/admin/settings/vector-database",
            lazy: async () => {
              const { default: GeneralVectorDatabase } = await import(
                "@/pages/GeneralSettings/VectorDatabase"
              );
              return {
                element: <AdminRoute Component={GeneralVectorDatabase} />,
              };
            },
          },
          {
            path: "/admin/settings/agents",
            lazy: async () => {
              const { default: AdminAgents } = await import("@/pages/Admin/Agents");
              return { element: <AdminRoute Component={AdminAgents} /> };
            },
          },
          {
            path: "/admin/settings/agents/builder",
            lazy: async () => {
              const { default: AgentBuilder } = await import(
                "@/pages/Admin/AgentBuilder"
              );
              return {
                element: (
                  <AdminRoute Component={AgentBuilder} hideUserMenu={true} />
                ),
              };
            },
          },
          {
            path: "/admin/settings/agents/builder/:flowId",
            lazy: async () => {
              const { default: AgentBuilder } = await import(
                "@/pages/Admin/AgentBuilder"
              );
              return {
                element: (
                  <AdminRoute Component={AgentBuilder} hideUserMenu={true} />
                ),
              };
            },
          },
          {
            path: "/admin/settings/event-logs",
            lazy: async () => {
              const { default: AdminLogs } = await import("@/pages/Admin/Logging");
              return { element: <AdminRoute Component={AdminLogs} /> };
            },
          },
          {
            path: "/admin/settings/embed-chat-widgets",
            lazy: async () => {
              const { default: ChatEmbedWidgets } = await import(
                "@/pages/GeneralSettings/ChatEmbedWidgets"
              );
              return { element: <AdminRoute Component={ChatEmbedWidgets} /> };
            },
          },
          {
            path: "/admin/settings/security",
            lazy: async () => {
              const { default: GeneralSecurity } = await import(
                "@/pages/GeneralSettings/Security"
              );
              return { element: <ManagerRoute Component={GeneralSecurity} /> };
            },
          },
          {
            path: "/admin/settings/privacy",
            lazy: async () => {
              const { default: PrivacyAndData } = await import(
                "@/pages/GeneralSettings/PrivacyAndData"
              );
              return { element: <AdminRoute Component={PrivacyAndData} /> };
            },
          },
          {
            path: "/admin/settings/interface",
            lazy: async () => {
              const { default: InterfaceSettings } = await import(
                "@/pages/GeneralSettings/Settings/Interface"
              );
              return { element: <ManagerRoute Component={InterfaceSettings} /> };
            },
          },
          {
            path: "/admin/settings/branding",
            lazy: async () => {
              const { default: BrandingSettings } = await import(
                "@/pages/GeneralSettings/Settings/Branding"
              );
              return { element: <ManagerRoute Component={BrandingSettings} /> };
            },
          },
          {
            path: "/admin/settings/default-system-prompt",
            lazy: async () => {
              const { default: DefaultSystemPrompt } = await import(
                "@/pages/Admin/DefaultSystemPrompt"
              );
              return { element: <AdminRoute Component={DefaultSystemPrompt} /> };
            },
          },
          {
            path: "/admin/settings/chat",
            lazy: async () => {
              const { default: ChatSettings } = await import(
                "@/pages/GeneralSettings/Settings/Chat"
              );
              return { element: <ManagerRoute Component={ChatSettings} /> };
            },
          },
          {
            path: "/admin/settings/beta-features",
            lazy: async () => {
              const { default: ExperimentalFeatures } = await import(
                "@/pages/Admin/ExperimentalFeatures"
              );
              return { element: <AdminRoute Component={ExperimentalFeatures} /> };
            },
          },
          {
            path: "/admin/settings/api-keys",
            lazy: async () => {
              const { default: GeneralApiKeys } = await import(
                "@/pages/GeneralSettings/ApiKeys"
              );
              return { element: <AdminRoute Component={GeneralApiKeys} /> };
            },
          },
          {
            path: "/admin/settings/system-prompt-variables",
            lazy: async () => {
              const { default: SystemPromptVariables } = await import(
                "@/pages/Admin/SystemPromptVariables"
              );
              return {
                element: <AdminRoute Component={SystemPromptVariables} />,
              };
            },
          },
          {
            path: "/admin/settings/browser-extension",
            lazy: async () => {
              const { default: GeneralBrowserExtension } = await import(
                "@/pages/GeneralSettings/BrowserExtensionApiKey"
              );
              return {
                element: <ManagerRoute Component={GeneralBrowserExtension} />,
              };
            },
          },
          {
            path: "/admin/settings/workspace-chats",
            lazy: async () => {
              const { default: GeneralChats } = await import(
                "@/pages/GeneralSettings/Chats"
              );
              return { element: <ManagerRoute Component={GeneralChats} /> };
            },
          },
          {
            path: "/admin/settings/invites",
            lazy: async () => {
              const { default: AdminInvites } = await import(
                "@/pages/Admin/Invitations"
              );
              return { element: <ManagerRoute Component={AdminInvites} /> };
            },
          },
          {
            path: "/admin/settings/users",
            lazy: async () => {
              const { default: AdminUsers } = await import("@/pages/Admin/Users");
              return { element: <ManagerRoute Component={AdminUsers} /> };
            },
          },
          {
            path: "/admin/settings/workspaces",
            lazy: async () => {
              const { default: AdminWorkspaces } = await import(
                "@/pages/Admin/Workspaces"
              );
              return { element: <ManagerRoute Component={AdminWorkspaces} /> };
            },
          },
          {
            path: "/admin/settings/beta-features/live-document-sync/manage",
            lazy: async () => {
              const { default: LiveDocumentSyncManage } = await import(
                "@/pages/Admin/ExperimentalFeatures/Features/LiveSync/manage"
              );
              return {
                element: <AdminRoute Component={LiveDocumentSyncManage} />,
              };
            },
          },
          {
            path: "/admin/settings/community-hub/trending",
            lazy: async () => {
              const { default: CommunityHubTrending } = await import(
                "@/pages/GeneralSettings/CommunityHub/Trending"
              );
              return { element: <AdminRoute Component={CommunityHubTrending} /> };
            },
          },
          {
            path: "/admin/settings/community-hub/authentication",
            lazy: async () => {
              const { default: CommunityHubAuthentication } = await import(
                "@/pages/GeneralSettings/CommunityHub/Authentication"
              );
              return {
                element: <AdminRoute Component={CommunityHubAuthentication} />,
              };
            },
          },
          {
            path: "/admin/settings/community-hub/import-item",
            lazy: async () => {
              const { default: CommunityHubImportItem } = await import(
                "@/pages/GeneralSettings/CommunityHub/ImportItem"
              );
              return {
                element: <AdminRoute Component={CommunityHubImportItem} />,
              };
            },
          },
          {
            path: "/admin/settings/mobile-connections",
            lazy: async () => {
              const { default: MobileConnections } = await import(
                "@/pages/GeneralSettings/MobileConnections"
              );
              return { element: <ManagerRoute Component={MobileConnections} /> };
            },
          },
          {
            path: "/admin/settings/external-connections/telegram",
            lazy: async () => {
              const { default: TelegramBotSettings } = await import(
                "@/pages/GeneralSettings/Connections/TelegramBot"
              );
              return { element: <AdminRoute Component={TelegramBotSettings} /> };
            },
          },
          {
            path: "/admin/settings/scheduled-jobs",
            lazy: async () => {
              const { default: ScheduledJobs } = await import(
                "@/pages/GeneralSettings/ScheduledJobs"
              );
              return { element: <SingleUserRoute Component={ScheduledJobs} /> };
            },
          },
          {
            path: "/admin/settings/scheduled-jobs/:id/runs",
            lazy: async () => {
              const { default: ScheduledJobRuns } = await import(
                "@/pages/GeneralSettings/ScheduledJobs/RunHistoryPage"
              );
              return { element: <SingleUserRoute Component={ScheduledJobRuns} /> };
            },
          },
          {
            path: "/admin/settings/scheduled-jobs/:id/runs/:runId",
            lazy: async () => {
              const { default: ScheduledJobRunDetail } = await import(
                "@/pages/GeneralSettings/ScheduledJobs/RunDetailPage"
              );
              return {
                element: <SingleUserRoute Component={ScheduledJobRunDetail} />,
              };
            },
          },
        ],
      },
      // Catch-all route for 404s
      {
        path: "*",
        lazy: async () => {
          const { default: NotFound } = await import("@/pages/404");
          return { element: <NotFound /> };
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <REACTWRAP>
    <RouterProvider router={router} />
  </REACTWRAP>
);
