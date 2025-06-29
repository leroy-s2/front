import { useNews } from "../api/useNews";
import { NewsCarousel } from "../components/NewsCarousel";
import { ComunidadesBasicas } from "../components/ComunidadesBasicas";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/theme/ThemeContext";

export function ContentInicio() {
  const { news, loading, error } = useNews("techcrunch", "70cd9b04d9844ecd8454453f2fc661e7");
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"
      }`}
    >
      <div className="p-8 max-w-7xl mx-auto">
        {/* Barra superior */}
        <div
          className={`flex justify-between items-center mb-6 border rounded p-3 ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <div className={`flex items-center gap-2 text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            <svg
              className={`w-5 h-5 text-blue-400`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2v-2H3v2zm4 0h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17h18M3 7h18" />
            </svg>
            Únete y aprende
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 rounded text-white font-semibold hover:opacity-90 transition">
            comenzar →
          </button>
        </div>

        {/* Título Novedades */}
        <h2
          className={`font-bold text-lg mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Novedades
        </h2>

        {/* Carrusel de noticias */}
        <NewsCarousel news={news} loading={loading} error={error} />

        {/* Comunidades y botón */}
        <div className="flex justify-between items-center mb-4 mt-8">
          <h2
            className={`font-bold text-lg ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Descubre nuevas comunidades
          </h2>
          <button
            className={`transition font-semibold ${
              isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => navigate("/Inicio/comunidadesdisponibles")}
          >
            Ver más ▼
          </button>
        </div>

        {/* Comunidades básicas (compacto) */}
        <ComunidadesBasicas compact limit={4} />
      </div>
    </div>
  );
}