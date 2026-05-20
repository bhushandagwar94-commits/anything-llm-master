import useLoginMode from "@/hooks/useLoginMode";
import usePfp from "@/hooks/usePfp";
import useUser from "@/hooks/useUser";
import System from "@/models/system";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import { Person } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import AccountModal from "../AccountModal";
import {
  AUTH_TIMESTAMP,
  AUTH_TOKEN,
  AUTH_USER,
  LAST_VISITED_WORKSPACE,
  USER_PROMPT_INPUT_MAP,
} from "@/utils/constants";
import { useTranslation } from "react-i18next";

export default function UserButton({ isStatic = false }) {
  const { t } = useTranslation();
  const mode = useLoginMode();
  const { user } = useUser();
  const menuRef = useRef();
  const buttonRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");

  const handleClose = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }
  };

  const handleOpenAccountModal = () => {
    setShowAccountSettings(true);
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClose);
    }
    return () => document.removeEventListener("mousedown", handleClose);
  }, [showMenu]);

  useEffect(() => {
    const fetchSupportEmail = async () => {
      const supportEmail = await System.fetchSupportEmail();
      setSupportEmail(
        supportEmail?.email
          ? `mailto:${supportEmail.email}`
          : paths.mailToMintplex()
      );
    };
    fetchSupportEmail();
  }, []);

  const isPublic = window.location.pathname === "/";
  if (isPublic || mode === null || (user && user.role !== "admin")) return null;
  return (
    <div className={isStatic ? "relative" : "absolute top-3 right-4 md:top-9 md:right-10 w-fit h-fit z-40"}>
      <button
        ref={buttonRef}
        onClick={() => setShowMenu(!showMenu)}
        type="button"
        className="uppercase transition-all duration-300 w-[38px] h-[38px] text-xs font-bold rounded-xl flex items-center bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl justify-center text-white shadow-lg group"
      >
        {mode === "multi" ? <UserDisplay /> : <Person size={18} className="text-white/60 group-hover:text-white transition-colors" />}
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="w-56 rounded-2xl absolute top-12 right-0 bg-[#0f172a]/95 light:bg-white/95 backdrop-blur-2xl p-2 flex flex-col shadow-2xl border border-white/10 light:border-black/5 z-[100] animate-fadeIn"
        >
          <div className="px-4 py-3 border-b border-white/5 light:border-black/5 mb-2">
            <p className="text-xs font-bold text-white/40 light:text-black/40 uppercase tracking-widest">Account</p>
            <p className="text-sm font-bold text-white light:text-slate-900 truncate">{user?.username || "Admin"}</p>
          </div>
          <div className="flex flex-col gap-y-1">
            {mode === "multi" && !!user && (
              <button
                onClick={handleOpenAccountModal}
                className="flex items-center gap-x-3 text-white/70 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/5 w-full text-left px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
              >
                {t("profile_settings.account")}
              </button>
            )}
            <a
              href={supportEmail}
              className="flex items-center gap-x-3 text-white/70 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-black/5 w-full text-left px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              {t("profile_settings.support")}
            </a>
            <button
              onClick={() => {
                window.localStorage.removeItem(AUTH_USER);
                window.localStorage.removeItem(AUTH_TOKEN);
                window.localStorage.removeItem(AUTH_TIMESTAMP);
                window.localStorage.removeItem(LAST_VISITED_WORKSPACE);
                window.localStorage.removeItem(USER_PROMPT_INPUT_MAP);
                window.location.replace(paths.home());
              }}
              type="button"
              className="flex items-center gap-x-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-left px-3 py-2 rounded-xl transition-all duration-200 text-sm font-bold"
            >
              {t("profile_settings.signout")}
            </button>
          </div>
        </div>
      )}
      {user && showAccountSettings && (
        <AccountModal
          user={user}
          hideModal={() => setShowAccountSettings(false)}
        />
      )}
    </div>
  );
}

function UserDisplay() {
  const { pfp } = usePfp();
  const user = userFromStorage();

  if (pfp) {
    return (
      <div className="w-[38px] h-[38px] rounded-xl flex-shrink-0 overflow-hidden transition-all duration-300 border-transparent border group-hover:border-white/20">
        <img
          src={pfp}
          alt="User profile picture"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    );
  }

  return (
    <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-700 text-white text-xs font-bold shadow-inner">
      {user?.username?.slice(0, 2).toUpperCase() || "AD"}
    </div>
  );
}
