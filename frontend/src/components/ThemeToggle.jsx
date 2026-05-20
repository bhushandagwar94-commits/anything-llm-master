import React from "react";
import { Sun, Moon } from "@phosphor-icons/react";
import { useThemeContext } from "@/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme, isLight } = useThemeContext();

  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 md:p-2.5 rounded-lg bg-white/5 hover:bg-white/10 light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-200 backdrop-blur-md transition-all duration-300 group shadow-sm flex items-center justify-center"
      title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {isLight ? (
        <Sun size={20} className="text-slate-700 group-hover:text-slate-900" />
      ) : (
        <Moon size={20} className="text-slate-200 group-hover:text-white" />
      )}
    </button>
  );
}
