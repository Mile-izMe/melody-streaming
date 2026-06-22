"use client";

import { useAuthStore } from "@/store/authStore";
import {
  Compass,
  FolderHeart,
  History,
  LogIn,
  LogOut,
  Music2,
  Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import LocaleSwitcher from "../ui/LocaleSwitcher";

export default function NavBar() {
  const t = useTranslations("navbar");
  const { locale } = useParams<{ locale?: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const localizedPathname = locale
    ? pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/"
    : pathname;

  const localizedHref = (href: string) =>
    locale ? `/${locale}${href === "/" ? "" : href}` : href;

  const NAV_LINKS = [
    { href: "/", label: t("explore"), icon: Compass },
    { href: "/playlists", label: t("library"), icon: FolderHeart },
    { href: "/history", label: t("recent"), icon: History },
  ];

  const isActive = (href: string) =>
    href === "/"
      ? localizedPathname === "/"
      : localizedPathname.startsWith(href);

  const navCls = (href: string) =>
    `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 border ${
      isActive(href)
        ? "bg-amber-950/40 text-amber-400 border-amber-900/30"
        : "text-stone-400 hover:text-amber-300 hover:bg-stone-900/30 border-transparent"
    }`;

  return (
    <nav className="mb-5 fixed top-0 left-0 right-0 z-40 transition-all duration-500 backdrop-blur-xl bg-stone-950/60 border-b border-amber-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Luxury Japanese Branding */}
          <Link
            href="/"
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
            </div>
          </Link>

          {/* Navigation Links (Minimalist Space Grotesk Style) */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={localizedHref(href)}
                className={navCls(href)}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}

            {/* Upload Button - Protected */}
            <button
              onClick={() =>
                user?.isLoggedIn
                  ? router.push(localizedHref("/upload"))
                  : router.push(localizedHref("/authentication"))
              }
              className={navCls("/upload") + " cursor-pointer"}
            >
              <Upload className="w-4 h-4" />
              <span>{t("upload")}</span>
              {!user?.isLoggedIn && (
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono font-bold leading-none">
                  LOCK
                </span>
              )}
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <LocaleSwitcher />

            {/* Authentication */}
            {user?.isLoggedIn ? (
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
                    {user.email}
                  </span>
                </div>

                <div className="w-[1px] h-4 bg-stone-800 mx-1" />

                <button
                  onClick={async () => {
                    await logout();
                    router.push(localizedHref("/"));
                  }}
                  className="cursor-pointer text-stone-500 hover:text-red-400 transition-colors duration-300"
                  title={t("logout")}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push(localizedHref("/authentication"))}
                className="cursor-pointer relative flex items-center space-x-2 px-5 py-2.5 rounded-full overflow-hidden transition-all duration-500 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 shadow-md shadow-amber-950/30 group active:scale-95"
              >
                <LogIn className="w-4 h-4 text-stone-100 group-hover:translate-x-0.5 transition-transform duration-300" />
                <span className="text-xs font-sans font-semibold text-stone-100 tracking-wider">
                  {t("login")}
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
