// src/components/NewsCarousel.tsx
import { useRef } from "react";
import type{ NewsArticle } from "../api/useNews";
import { NewsItem } from "./NewsItem";

interface NewsCarouselProps {
  news: NewsArticle[];
  loading: boolean;
  error: string | null;
}

export function NewsCarousel({ news, loading, error }: NewsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getScrollWidth = () => {
    if (!containerRef.current) return 0;
    return (containerRef.current.clientWidth - 64) / 3;
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      const width = getScrollWidth();
      containerRef.current.scrollBy({ left: -width, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const width = getScrollWidth();
      containerRef.current.scrollBy({ left: width, behavior: "smooth" });
    }
  };

  return (
    <div className="relative mb-6">
      {/* Botón izquierda */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 z-10"
        aria-label="Anterior"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Botón derecha */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 z-10"
        aria-label="Siguiente"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Contenedor scroll horizontal con altura ajustada */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto hide-scrollbar h-60" 
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          paddingLeft: "16px",
          paddingRight: "16px",
          gap: "16px",
        }}
      >
        {loading && <p className="text-white">Cargando noticias...</p>}
        {!loading && error && <p className="text-red-500 font-semibold">Error: {error}</p>}
        {!loading && !error && news.length === 0 && <p className="text-white">No hay noticias disponibles.</p>}
        {!loading &&
          !error &&
          news.map((item, index) => <NewsItem key={index} article={item} />)}
      </div>
    </div>
  );
}