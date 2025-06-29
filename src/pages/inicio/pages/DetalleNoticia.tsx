import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/theme/ThemeContext";

type NewsArticle = {
  title: string;
  description: string;
  content?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  urlToImage?: string | null;
  url?: string | null;
  source?: {
    name?: string;
  } | null;
};

export function DetalleNoticia() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const article = location.state?.article as NewsArticle | undefined;

  if (!article) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"
        }`}
      >
        <div className="p-8 max-w-3xl mx-auto">
          <p>No se encontró la noticia.</p>
          <button
            onClick={() => navigate("/Inicio")}
            className="mt-4 px-4 py-2 rounded bg-purple-700 hover:bg-purple-600 text-white"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"
      }`}
    >
      <div className="p-8 pr-24 max-w-3xl mx-auto relative flex flex-col">
        <button
          onClick={() => navigate("/Inicio")}
          className="absolute top-8 right-4 px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold hover:opacity-90 transition shadow-lg"
        >
          ← Atrás
        </button>

        <h2 className="text-2xl font-bold mb-2">{article.title}</h2>

        <p className="text-sm uppercase font-semibold text-purple-400 mb-2">
          {article.source?.name || "Fuente Desconocida"}
        </p>

        {article.author && (
          <p className="text-xs text-gray-400 mb-1">Por {article.author}</p>
        )}

        {article.publishedAt && (
          <p className="text-xs text-gray-400 mb-4">
            {new Date(article.publishedAt).toLocaleString()}
          </p>
        )}

        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="rounded mb-6 max-h-96 object-contain mx-auto"
          />
        )}

        <p className="text-lg mb-4">{article.description}</p>

        {article.content && (
          <p className="text-gray-300 whitespace-pre-line">{article.content}</p>
        )}

        {article.url && (
          <button
            onClick={() => {
              if (article.url) {
                window.open(article.url, "_blank", "noopener,noreferrer");
              }
            }}
            className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
            aria-label="Ver noticia original"
          >
            Ver noticia original
          </button>
        )}
      </div>
    </div>
  );
}