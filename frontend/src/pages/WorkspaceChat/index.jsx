import React, { useEffect, useState } from "react";
import { default as WorkspaceChatContainer } from "@/components/WorkspaceChat";
import Sidebar from "@/components/Sidebar";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import { LAST_VISITED_WORKSPACE } from "@/utils/constants";
import useUser from "@/hooks/useUser";
import AppErrorBoundary from "@/components/AppErrorBoundary";

export default function WorkspaceChat() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  const { user } = useUser();
  const isAdmin = user?.role === "admin" || user === null;

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <AppErrorBoundary>
      <div className="w-screen h-screen overflow-hidden bg-[#030712] light:bg-[#f1f5f9] flex transition-colors duration-300">
        {isAdmin && !isMobile && <Sidebar />}
        <div className="flex-1 overflow-hidden relative">
          <ShowWorkspaceChat />
        </div>
      </div>
    </AppErrorBoundary>
  );
}

function ShowWorkspaceChat() {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState(null);
  // Tracks which workspace `workspace` belongs to. While a new workspace's
  // data is in flight, we keep the previous workspace's chat mounted
  // (Slack/Linear-style transition) instead of flashing a skeleton.
  const [loadedSlug, setLoadedSlug] = useState(null);

  useEffect(() => {
    async function getWorkspace() {
      if (!slug) return;
      const _workspace = await Workspace.bySlug(slug);
      if (!_workspace) {
        setWorkspace(null);
        setLoadedSlug(slug);
        return;
      }

      const [suggestedMessages, { showAgentCommand }] = await Promise.all([
        Workspace.getSuggestedMessages(slug),
        Workspace.agentCommandAvailable(slug),
      ]);
      setWorkspace({
        ..._workspace,
        suggestedMessages,
        showAgentCommand,
      });
      setLoadedSlug(slug);
      localStorage.setItem(
        LAST_VISITED_WORKSPACE,
        JSON.stringify({
          slug: _workspace.slug,
          name: _workspace.name,
        })
      );
    }
    getWorkspace();
  }, [slug]);

  return (
    <WorkspaceChatContainer
      loading={loadedSlug !== slug}
      workspace={workspace}
    />
  );
}
