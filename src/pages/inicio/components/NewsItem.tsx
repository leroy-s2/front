// src/components/NewsItem.tsx
import type{ NewsArticle } from "../api/useNews";
import { useNavigate } from "react-router-dom";

interface NewsItemProps {
  article: NewsArticle;
  widthCalc?: string; // opcional para estilos de ancho
}

export function NewsItem({ article, widthCalc = "calc((100vw - 64px) / 3)" }: NewsItemProps) {
  const navigate = useNavigate();

  return (
    <article
      className="bg-white text-gray-900 rounded shadow-md flex-none cursor-pointer"
      style={{
        width: widthCalc,
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
      onClick={() => navigate("/Inicio/novedades", { state: { article } })}
    >
      <img
        src={article.urlToImage || ""}
        alt={article.title}
        className="object-cover w-full h-36 rounded-t"
      />
      <h3 className="font-extrabold text-md p-3 line-clamp-2">{article.title}</h3>
    </article>
  );
}