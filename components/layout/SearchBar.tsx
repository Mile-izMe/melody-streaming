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

  // Wait after 300ms when user stop entering then debouncedSearchTerm changes
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    // If user clear the search term, reset the results
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
        // Fallback
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
      style={{ position: "relative", width: "380px", margin: "0 auto" }}
    >
      <Search
        size={16}
        style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#FFC82D",
          pointerEvents: "none",
          zIndex: 1,
        }}
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
        style={{
          width: "100%",
          padding: "12px 16px 12px 38px",
          borderRadius: "24px",
          border: "1px solid #FFC82D",
          outline: "none",
        }}
      />

      {/* Icon Loading */}
      {isLoading && (
        <div style={{ position: "absolute", right: "16px", top: "12px" }}>
          ⏳
        </div>
      )}

      {/* Dropdown Results (Shown when results are available) */}
      {results && (results.songs.length > 0 || results.artists.length > 0) && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: 0,
            right: 0,
            backgroundColor: "#100C0B",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            padding: "12px",
            zIndex: 1000,
          }}
        >
          {/* Render Artists */}
          {results.artists.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h4
                style={{ margin: "0 0 8px 0", color: "#666", fontSize: "12px" }}
              >
                {t("artists")}
              </h4>
              {results.artists.map((artist) => (
                <div
                  key={artist.id}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#eee",
                      marginRight: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      color: "#555",
                    }}
                  >
                    {artist.title.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{artist.title}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>
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
              <h4
                style={{ margin: "0 0 8px 0", color: "#666", fontSize: "12px" }}
              >
                {t("songs")}
              </h4>
              {results.songs.map((song) => (
                <div
                  key={song.id}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={song.thumbnailUrl || "/default-cover.jpg"}
                    alt="cover"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "4px",
                      marginRight: "12px",
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: "bold" }}>{song.title}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>
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
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: 0,
              right: 0,
              backgroundColor: "#100C0B",
              padding: "16px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          >
            {t("no_results", { term: searchTerm })}
          </div>
        )}
    </form>
  );
}
