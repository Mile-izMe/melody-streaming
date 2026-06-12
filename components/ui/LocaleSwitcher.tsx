"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { locales, type Locale } from "@/i18n/config";

export default function LocaleSwitcher() {
  const { locale } = useParams<{ locale: Locale }>();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  useEffect(() => {
    if (!locale) return;
    // set cookie when locale param changes
    try {
      document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    } catch (e) {
      // noop
    }
  }, [locale]);

  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`text-xs font-mono tracking-widest px-2 py-1 rounded transition-colors ${
            locale === l
              ? "text-amber-400 border border-amber-900/50"
              : "text-stone-500 hover:text-amber-300"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
