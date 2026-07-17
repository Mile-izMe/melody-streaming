"use client";

import { useDebounce } from "@/hooks";
import { searchApi, SearchResponse } from "@/libs";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("search");
  const router = useRouter();
  const { locale } = useParams<{ locale?: string }>();

  const localizedHref = (href: string) =>
    locale ? `/${locale}${href === "/" ? "" : href}` : href;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keyword = searchTerm.trim();
    if (!keyword) {
      return;
    }

    router.push(
      localizedHref(`/search?keyword=${encodeURIComponent(keyword)}`),
    );
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const data = await searchApi.search(debouncedSearchTerm);
        setResults(data);
      } catch (error) {
        console.error("Error searching:", error);
        setResults({ songs: [], artists: [], total: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm]);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-[380px] mx-auto px-4 md:px-0"
    >
      <Search
        size={16}
        className="absolute left-7 md:left-4 top-1/2 -translate-y-1/2 text-[#FFC82D] pointer-events-none z-10"
      />

      {/* Input */}
      <input
        type="text"
        placeholder={t("placeholder")}
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);

          if (!value.trim()) {
            setResults(null);
          }
        }}
        className="w-full py-3 pr-10 pl-10 rounded-full border border-[#FFC82D] outline-none bg-transparent text-stone-200 placeholder:text-stone-500 focus:ring-1 focus:ring-[#FFC82D] transition-all"
      />

      {/* Icon Loading */}
      {isLoading && (
        <div className="absolute right-8 md:right-4 top-1/2 -translate-y-1/2 text-sm">
          ⏳
        </div>
      )}

      {/* Dropdown Results */}
      {results && (results.songs.length > 0 || results.artists.length > 0) && (
        <div
          // max-h-[60vh] và overflow-y-auto giúp cuộn được kết quả trên điện thoại
          className="absolute top-[56px] left-4 right-4 md:left-0 md:right-0 bg-[#100C0B] shadow-2xl rounded-xl p-3 z-[1000] max-h-[60vh] overflow-y-auto border border-stone-800 custom-scrollbar"
        >
          {/* Render Artists */}
          {results.artists.length > 0 && (
            <div className="mb-4">
              <h4 className="m-0 mb-2 text-stone-400 text-xs font-semibold uppercase tracking-wider px-2">
                {t("artists")}
              </h4>
              {results.artists.map((artist) => (
                <div
                  key={artist.id}
                  className="p-2 cursor-pointer flex items-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-800 mr-3 flex items-center justify-center font-bold text-stone-400 shrink-0">
                    {artist.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-stone-200 truncate">
                      {artist.title}
                    </div>
                    <div className="text-xs text-stone-500 truncate">
                      {artist.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render Songs */}
          {results.songs.length > 0 && (
            <div>
              <h4 className="m-0 mb-2 text-stone-400 text-xs font-semibold uppercase tracking-wider px-2">
                {t("songs")}
              </h4>
              {results.songs.map((song) => (
                <div
                  key={song.id}
                  className="p-2 cursor-pointer flex items-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  <img
                    src={song.thumbnailUrl || "/default-cover.jpg"}
                    alt="cover"
                    className="w-10 h-10 rounded-md mr-3 object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="font-bold text-stone-200 truncate">
                      {song.title}
                    </div>
                    <div className="text-xs text-stone-500 truncate">
                      {song.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No results */}
      {results &&
        results.songs.length === 0 &&
        results.artists.length === 0 &&
        !isLoading && (
          <div className="absolute top-[56px] left-4 right-4 md:left-0 md:right-0 bg-[#100C0B] p-4 text-center shadow-2xl rounded-xl border border-stone-800 text-stone-400 text-sm">
            {t("no_results", { term: searchTerm })}
          </div>
        )}
    </form>
  );
}
