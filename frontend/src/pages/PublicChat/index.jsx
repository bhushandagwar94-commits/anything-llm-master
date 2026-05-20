import React, { useEffect, useState, useRef } from "react";
import System from "@/models/system";
import Embed from "@/models/embed";
import { PROMPT_INPUT_EVENT, PROMPT_INPUT_ID } from "@/components/WorkspaceChat/ChatContainer/PromptInput";
import PromptInput from "@/components/WorkspaceChat/ChatContainer/PromptInput";
import ChatHistory from "@/components/WorkspaceChat/ChatContainer/ChatHistory";
import useLogo from "@/hooks/useLogo";
import GlobalConfig from "@/models/config";
import { ThoughtExpansionProvider } from "@/components/WorkspaceChat/ChatContainer/ChatHistory/ThoughtContainer";
import { MessageActionsProvider } from "@/components/WorkspaceChat/ChatContainer/ChatHistory/MessageActionsContext";
import { SourcesSidebarProvider } from "@/components/WorkspaceChat/ChatContainer/SourcesSidebar";
import { sanitizeAssistantOutput } from "@/utils/chat/sanitize";
import { StreamingAccumulator } from "@/utils/ai/responseParser";
import { clearPromptInputDraft } from "@/hooks/usePromptInputStorage";
import ThemeToggle from "@/components/ThemeToggle";
import { useThemeContext } from "@/ThemeContext";
import { REFETCH_LOGO_EVENT } from "@/LogoContext";
import DnDFileUploaderWrapper, { 
  DnDFileUploaderProvider, 
  DndUploaderContext 
} from "@/components/WorkspaceChat/ChatContainer/DnDWrapper";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";

import AppErrorBoundary from "@/components/AppErrorBoundary";
import SafeRenderBoundary from "@/components/AIBlocks/SafeRenderBoundary";
import { useBranding } from "@/BrandingContext";
import WelcomeMessage from "@/components/Branding/WelcomeMessage";

export default function PublicChat() {
  const [embedUuid, setEmbedUuid] = useState(null);
  const [workspaceSlug, setWorkspaceSlug] = useState(null);

  return (
    <AppErrorBoundary>
      <SafeRenderBoundary>
        <DnDFileUploaderProvider workspace={{ slug: workspaceSlug || "public" }}>
          <PublicChatInterface 
            setEmbedUuid={setEmbedUuid} 
            embedUuid={embedUuid} 
            workspaceSlug={workspaceSlug}
            setWorkspaceSlug={setWorkspaceSlug}
          />
        </DnDFileUploaderProvider>
      </SafeRenderBoundary>
    </AppErrorBoundary>
  );
}
 
function PublicChatInterface({ setEmbedUuid, embedUuid, workspaceSlug, setWorkspaceSlug }) {
  const { logo } = useLogo();
  const { parseAttachments } = useContext(DndUploaderContext);
  const { isLight } = useThemeContext();
  const [sessionId, setSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const { branding } = useBranding();
  const scrollRef = useRef(null);
  const hasInitialized = useRef(false);

  // Workspace Sync only
  const refreshWorkspace = async () => {
    try {
      const wpRes = await GlobalConfig.getPublicWorkspace();
      setEmbedUuid(wpRes?.embed_uuid);
      setWorkspaceSlug(wpRes?.workspace?.slug);
      window.dispatchEvent(new CustomEvent(REFETCH_LOGO_EVENT));
    } catch (e) {
      console.error("Workspace sync failed:", e);
    }
  };

  useEffect(() => {
    async function initChat() {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      // Clear sessions to ensure fresh start on reload
      localStorage.removeItem("seetech_session_id");
      localStorage.removeItem("public_chat_history");
      clearPromptInputDraft("undefined");
      clearPromptInputDraft("public");

      const sid = uuidv4();
      setSessionId(sid);
      sessionStorage.setItem("seetech_active_session_id", sid);

      try {
        await refreshWorkspace();
        setHistory([]);
      } catch (e) {
        console.error("Failed to initialize public chat:", e);
      } finally {
        setLoading(false);
      }
    }
    initChat();

    const syncInterval = setInterval(() => {
      refreshWorkspace();
    }, 15000);

    return () => {
      console.log("[CLEANUP] Clearing sync interval");
      clearInterval(syncInterval);
    };
  }, []); // Only run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById(PROMPT_INPUT_ID);
    const message = input?.value?.trim();
    if (!message || isStreaming) return;

    const userMsg = { role: "user", content: message, sentAt: Date.now() / 1000 };
    setHistory(prev => [...prev, userMsg]);
    
    window.dispatchEvent(new CustomEvent(PROMPT_INPUT_EVENT, { detail: { messageContent: "" } }));
    setIsStreaming(true);

    const attachments = parseAttachments();
 
    const safeEmbedUuid = embedUuid || "public";
    const safeMessage = message || "";
    const safeAttachments = attachments || [];
 
    try {
      if (!embedUuid) {
        throw new Error("Missing public embed UUID. Please refresh or contact administrator.");
      }
 
      const response = await Embed.streamChat(safeEmbedUuid, safeMessage, sessionId, safeAttachments);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to connect to assistant.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const accumulator = new StreamingAccumulator();
      let assistantMsg = { role: "assistant", content: "", sentAt: Date.now() / 1000, animate: true, blocks: [] };
      setHistory(prev => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);

        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const jsonLine = line.startsWith("data: ") ? line.slice(6) : line;
            const data = JSON.parse(jsonLine);
            if (data.type === "textResponseChunk" && data.textResponse) {
              assistantMsg.content += data.textResponse;
              setHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { ...assistantMsg };
                return newHistory;
              });
            }
          } catch (e) {}
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setHistory(prev => [...prev, { role: "assistant", content: "Trouble connecting. Please try again.", error: true, animate: false }]);
    } finally {
      setHistory(prev => {
        if (prev.length === 0) return prev;
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.role === "assistant") {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { ...lastMsg, animate: false };
          return newHistory;
        }
        return prev;
      });
      setIsStreaming(false);
    }
  };

  const sendSuggested = (msg) => {
    const input = document.getElementById(PROMPT_INPUT_ID);
    if (input) {
      input.value = msg;
      window.dispatchEvent(new CustomEvent(PROMPT_INPUT_EVENT, { detail: { messageContent: msg } }));
      handleSubmit({ preventDefault: () => {} });
    }
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center industrial-bg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500/50"></div>
    </div>
  );
 
  if (!embedUuid || !workspaceSlug) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center industrial-bg space-y-6">
      <div className="text-white/60 text-xl font-light italic uppercase tracking-widest animate-pulse">Initializing SEETECH AI Gateway...</div>
      <div className="text-white/20 text-xs">Awaiting workspace synchronization...</div>
    </div>
  );

  return (
    <SourcesSidebarProvider>
      <MessageActionsProvider>
        <ThoughtExpansionProvider>
          <div className={`h-screen w-screen flex items-center justify-center seetech-iios-container p-2 md:p-4 ${isLight ? "light" : ""}`}>
            <div className="app-shell-window animate-in zoom-in-95 duration-700">
              
              {/* Refined Enterprise Industrial Navigation Bar */}
              <header className="h-[72px] md:h-[76px] w-full flex-none border-b border-blue-500/20 light:border-slate-200 bg-gradient-to-r from-[#0b1329] via-[#0e1b38] to-[#0b1329] light:bg-none light:bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,140,255,0.15)] light:shadow-sm z-30 transition-all duration-300 py-1">
                <div className="w-full h-full flex items-center justify-between px-4 md:px-6 relative">
                  {/* Left Section: Refined Logo */}
                  <div className="flex items-center z-10 flex-shrink-0">
                    <img src={logo || "/seetech-logo.png"} alt="SEETECH" className="h-10 md:h-11 w-auto object-contain transition-transform duration-300 hover:opacity-90" />
                  </div>

                  {/* Center Section: Title & Subtitle Lockup */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center text-center w-full max-w-[55%] md:max-w-[60%] pointer-events-none px-1 overflow-hidden z-10">
                    <span className="text-lg md:text-xl font-bold text-white light:text-[#0f172a] tracking-tight leading-none truncate w-full">
                      {branding.heading || "SEETECH AI"}
                    </span>
                    <span className="text-[10px] md:text-[11px] text-blue-400/80 light:text-slate-500 font-semibold tracking-wider uppercase leading-none mt-1.5 truncate w-full">
                      {branding.subtitle || "Industrial Intelligence & Energy Optimization Platform"}
                    </span>
                  </div>

                  {/* Right Section: Theme Toggle */}
                  <div className="flex items-center z-10 flex-shrink-0">
                    <ThemeToggle />
                  </div>
                </div>
              </header>

              {/* Perfectly Centered Chat History Area */}
              <main className="flex-1 overflow-hidden relative flex flex-col bg-transparent">
                <div className="flex-1 overflow-y-auto no-scroll scroll-smooth" ref={scrollRef}>
                  <div className="seetech-content-width flex flex-col min-h-full">
                    {history.length === 0 ? (
                      <WelcomeMessage sendCommand={sendSuggested} />
                    ) : (
                      <div className="flex-1 flex flex-col pt-2 md:pt-4">
                        <ChatHistory 
                          history={history} 
                          workspace={{ slug: "public", name: "SEETECH" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </main>

              {/* Perfectly Centered Input Footer */}
              <footer className="flex-none pb-3 pt-2 bg-gradient-to-t from-black/20 light:from-transparent to-transparent">
                <div className="seetech-content-width px-6 md:px-0">
                  <div className="w-full flex justify-center">
                    <DnDFileUploaderWrapper>
                      <PromptInput
                        workspace={{ slug: embedUuid }}
                        submit={handleSubmit}
                        isStreaming={isStreaming}
                        sendCommand={() => {}}
                        attachments={parseAttachments()}
                        centered={true}
                        workspaceSlug={workspaceSlug}
                        threadSlug={sessionId}
                        placeholder={branding.placeholder || "Ask SEETECH anything..."}
                      />
                    </DnDFileUploaderWrapper>
                  </div>
                  <div className="flex items-center justify-center gap-x-2 mt-2 opacity-20 light:opacity-30">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white light:text-slate-500 font-bold">
                      {branding.heading || "SEETECH AI"} INDUSTRIAL CONSOLE
                    </span>
                  </div>
                </div>
              </footer>

            </div>
          </div>
        </ThoughtExpansionProvider>
      </MessageActionsProvider>
    </SourcesSidebarProvider>
  );
}
