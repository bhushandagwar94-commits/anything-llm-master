import React from "react";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import Home from "./Home";
import { isMobile } from "react-device-detect";
import Sidebar, { SidebarMobileHeader } from "@/components/Sidebar";
import useUser from "@/hooks/useUser";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  const { user } = useUser();
  const isAdmin = user?.role === "admin" || user === null;


  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false)
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#030712] light:bg-[#f1f5f9] flex transition-colors duration-300">
      {isAdmin && (!isMobile ? <Sidebar /> : <SidebarMobileHeader />)}
      <div className="flex-1 overflow-hidden relative">
        <Home />
      </div>
    </div>
  );
}
