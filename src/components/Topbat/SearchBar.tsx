import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { cursoService } from "../../services/cursoService";
import { useApiRequest } from "../../services/servicecomunidad"; // Importamos el hook de la API
import type { Curso } from "../../models/Curso";
import type { Community } from "../../pages/inicio/models/Community";
import { useTheme } from "../../context/theme/ThemeContext";

type ResultadoBusqueda =
  | ({ tipo: "curso" } & Curso)
  | ({ tipo: "comunidad" } & Community);

interface SearchBarProps {
  onSelectCurso?: (curso: Curso) => void;
  onSelectComunidad?: (comunidad: Community) => void;
}

export function SearchBar({ onSelectCurso, onSelectComunidad }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const { isDarkMode } = useTheme();

  const { buscarComunidadesPorNombre } = useApiRequest(); // Usamos el hook para buscar comunidades

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 0) {
        Promise.all([
          cursoService.buscarCursosPorNombre(query),
          buscarComunidadesPorNombre(query),
        ]).then(([cursos, comunidades]) => {
          const resultadosCursos = cursos.map(curso => ({
            tipo: "curso" as const,
            ...curso,
          }));
          const resultadosComunidades = comunidades.map(comunidad => ({
            tipo: "comunidad" as const,
            ...comunidad,
          }));
          setResultados([...resultadosCursos, ...resultadosComunidades]);
          setMostrarResultados(true);
        });
      } else {
        setResultados([]);
        setMostrarResultados(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, buscarComunidadesPorNombre]); // Aseguramos que buscarComunidadesPorNombre se actualice

  return (
    <div
      className={`relative ${
        isDarkMode
          ? "text-gray-400 focus-within:text-gray-200"
          : "text-gray-600 focus-within:text-gray-800"
      } flex-grow max-w-xl mr-6`}
    >
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="search"
        placeholder="Qué quieres buscar"
        className={`w-full pl-10 pr-4 py-3 rounded border ${
          isDarkMode
            ? "border-blue-500 bg-transparent text-white caret-white placeholder-white placeholder-opacity-70 focus:border-blue-700 focus:ring-blue-500"
            : "border-gray-300 bg-white text-gray-900 caret-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-400"
        } focus:outline-none focus:ring-2`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => setMostrarResultados(false), 150)}
        onFocus={() => query && setMostrarResultados(true)}
      />

      {mostrarResultados && resultados.length > 0 && (
        <ul
          className={`absolute top-full left-0 right-0 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } mt-1 rounded shadow-lg max-h-60 overflow-y-auto z-50 border ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          {resultados.map((item, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer border-b ${
                isDarkMode
                  ? "hover:bg-gray-700 border-gray-600"
                  : "hover:bg-gray-100 border-gray-200"
              } last:border-b-0`}
              onClick={() => {
                setQuery(item.nombre);
                setMostrarResultados(false);
                if (item.tipo === "curso") {
                  onSelectCurso?.(item);
                } else {
                  onSelectComunidad?.(item);
                }
              }}
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">{item.nombre}</div>
                <div
                  className={`text-xs px-2 py-0.5 rounded ${
                    item.tipo === "curso"
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {item.tipo === "curso" ? "Curso" : "Comunidad"}
                </div>
              </div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {item.descripcion}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
