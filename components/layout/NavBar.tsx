import { ViewType, User as UserType } from "../../types";
import {
  Compass,
  FolderHeart,
  History,
  LogIn,
  LogOut,
  Music2,
  Sparkles,
  Upload,
} from "lucide-react";
import React from "react";

interface NavbarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  user: UserType;
  onOpenLogin: () => void;
  onLogout: () => void;
  zenMode: boolean;
  setZenMode: (val: boolean) => void;
}

function NavBar({
  activeView,
  setActiveView,
  user,
  onOpenLogin,
  onLogout,
  zenMode,
  setZenMode,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-500 backdrop-blur-xl bg-stone-950/60 border-b border-amber-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Luxury Japanese Branding */}
          <div
            onClick={() => setActiveView("home")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-950 p-[1px] shadow-lg shadow-amber-950/20 group-hover:shadow-amber-500/10 transition-shadow duration-500">
              <div className="absolute inset-0 rounded-xl bg-stone-950 m-[1px] flex items-center justify-center">
                <Music2 className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform duration-500" />
              </div>
              {/* Outer Golden Pulsing Halos */}
              <span className="absolute inset-0 rounded-xl bg-amber-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-sans font-semibold tracking-widest text-stone-200 group-hover:text-amber-400 transition-colors duration-300">
                MELODY{" "}
                <span className="text-amber-500 font-medium">STREAM</span>
              </span>
              <span className="text-[9px] font-mono tracking-[0.3em] text-stone-500 uppercase leading-none">
                メロディーストリーム
              </span>
            </div>
          </div>

          {/* Navigation Links (Minimalist Space Grotesk Style) */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveView("home")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                activeView === "home"
                  ? "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                  : "text-stone-400 hover:text-amber-300 hover:bg-stone-900/30 border border-transparent"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Khám Phá</span>
            </button>

            <button
              onClick={() => setActiveView("playlists")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                activeView === "playlists"
                  ? "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                  : "text-stone-400 hover:text-amber-300 hover:bg-stone-900/30 border border-transparent"
              }`}
            >
              <FolderHeart className="w-4 h-4" />
              <span>Thư Viện</span>
            </button>

            <button
              onClick={() => setActiveView("history")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                activeView === "history"
                  ? "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                  : "text-stone-400 hover:text-amber-300 hover:bg-stone-900/30 border border-transparent"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Gần Đây</span>
            </button>

            <button
              onClick={() => {
                if (user.isLoggedIn) {
                  setActiveView("upload");
                } else {
                  onOpenLogin();
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                activeView === "upload"
                  ? "bg-amber-950/50 text-amber-400 border border-amber-900/40"
                  : "text-stone-400 hover:text-amber-300 hover:bg-stone-950/30 border border-transparent"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Đăng Nhạc</span>
              {!user.isLoggedIn && (
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono font-bold leading-none">
                  LOCK
                </span>
              )}
            </button>
          </div>

          {/* Action Area: Zen Mode Toggle & User Auth Status */}
          <div className="flex items-center space-x-4">
            {/* Zen Ambient Immersive Toggle Button */}
            <button
              onClick={() => setZenMode(!zenMode)}
              className={`relative p-2.5 rounded-lg border transition-all duration-500 overflow-hidden group ${
                zenMode
                  ? "border-amber-500/50 text-amber-400 bg-amber-950/40"
                  : "border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-900/50 bg-stone-900/20"
              }`}
              title="Chế độ thiền định âm nhạc (Zen Cinematic Mode)"
            >
              <Sparkles
                className={`w-4 h-4 ${zenMode ? "animate-spin" : "group-hover:rotate-12"} transition-transform duration-700`}
                style={{ animationDuration: "6s" }}
              />
              {zenMode && (
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>

            {/* Authentication Triggers & User Card */}
            {user.isLoggedIn ? (
              <div className="flex items-center space-x-3 bg-stone-900/40 border border-amber-950/40 rounded-full py-1.5 pl-2 pr-4 shadow-inner">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-amber-500/30"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-900/60 flex items-center justify-center text-amber-300 text-xs font-bold border border-amber-500/30">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs text-stone-300 font-sans font-medium tracking-wide">
                    {user.username}
                  </span>
                  <span className="text-[8px] text-amber-500 font-mono tracking-wider mt-0.5">
                    ARTIST
                  </span>
                </div>

                <div className="w-[1px] h-4 bg-stone-800 mx-1" />

                <button
                  onClick={onLogout}
                  className="text-stone-500 hover:text-red-400 transition-colors duration-300"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="relative flex items-center space-x-2 px-5 py-2.5 rounded-full overflow-hidden transition-all duration-500 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 shadow-md shadow-amber-950/30 group active:scale-95"
              >
                <LogIn className="w-4 h-4 text-stone-100 group-hover:translate-x-0.5 transition-transform duration-300" />
                <span className="text-xs font-sans font-semibold text-stone-100 tracking-wider">
                  Đăng Nhập
                </span>
                <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
