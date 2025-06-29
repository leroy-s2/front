// src/hooks/useNews.ts
import { useState, useEffect } from "react";

export type NewsArticle = {
  title: string;
  description: string;
  content?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  urlToImage?: string | null;
  source?: {
    name?: string;
  } | null;
};

export function useNews(source: string, apiKey: string) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`)
      .then(async (res) => {
        const data = await res.json();
        if (data.status === "ok") {
          setNews(data.articles || []);
          setError(null);
        } else {
          setError(data.message || "Error desconocido en la API");
          setNews([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error desconocido al cargar noticias");
        setNews([]);
        setLoading(false);
      });
  }, [source, apiKey]);

  return { news, loading, error };
}
