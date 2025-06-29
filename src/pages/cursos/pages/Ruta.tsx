import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, Lock, PlayCircle, Circle } from "lucide-react";
import CursoHeader from "../components/Ruta/CursoHeader";
import CursosComplementarios from "../components/Ruta/CursosComplementarios";
import { useCursoDetalle } from "../hooks/useCursoDetalle";
import { useTheme } from "../../../context/theme/ThemeContext";
import type { SeccionDto, RecursoDto } from "../models/CursoDto";

const formatDuration = (totalSeconds: number): string => {
  if (!totalSeconds) return "0m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
};

const Ruta: React.FC = () => {
  const { id_curso } = useParams<{ id_curso: string }>();
  const idCursoNum = Number(id_curso);
  const { curso, loading, error } = useCursoDetalle(idCursoNum);
  const { isDarkMode } = useTheme();

  const [seccionesAbiertas, setSeccionesAbiertas] = React.useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  const toggleSeccion = (seccionId: number) => {
    setSeccionesAbiertas((prev) => ({
      ...prev,
      [seccionId]: !prev[seccionId],
    }));
  };

  if (loading) {
    return (
      <div className={`p-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Cargando...
      </div>
    );
  }
  
  if (error || !curso) {
    return (
      <div className={`p-6 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
        No se pudo cargar el curso
      </div>
    );
  }

  // Las secciones ya vienen ordenadas del hook
  const seccions: SeccionDto[] = curso.seccions ?? [];
  const totalClases = seccions.reduce(
    (acc: number, sec: SeccionDto) => acc + (sec.recursos?.length ?? 0), 0
  );
  const numSecciones = seccions.length;
  const totalDuracionSegundos = seccions.reduce(
    (acc: number, sec: SeccionDto) =>
      acc +
      (sec.recursos?.reduce(
        (sum: number, rec: RecursoDto) => sum + (rec.duracion_segundos ?? 0), 0
      ) ?? 0),
    0
  );
  const duracionFormateada = formatDuration(totalDuracionSegundos);

  return (
    <div className={`min-h-screen relative overflow-hidden font-sans ${
      isDarkMode ? "bg-gray-900" : "bg-blue-50"
    }`}>
      <div className="relative max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-10 lg:py-12">
        <CursoHeader
          nombre={curso.nombre}
          descripcion={curso.descripcion}
          estado={curso.estado}
          fecha_creacion={curso.fecha_creacion}
          stats={{
            totalLessons: totalClases,
            sectionsCount: numSecciones,
            totalDuration: duracionFormateada,
          }}
          rating={4.8}
          students={123456}
        />

        <div className={`border rounded-xl p-5 ${
          isDarkMode 
            ? "bg-gray-800/20 border-gray-700/30" 
            : "bg-white/80 border-gray-300/50"
        }`}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-0.5 h-5 bg-gradient-to-b from-sky-600 to-fuchsia-700 rounded-full"></div>
            <div>
              <h3 className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                TEMARIO COMPLETO
              </h3>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                {numSecciones} secciones • {totalClases} clases
              </p>
            </div>
          </div>
          
          <div className="grid gap-2.5">
            {seccions.map((sec: SeccionDto, idx: number) => {
              // Los recursos ya vienen ordenados del hook
              const recursosOrdenados = sec.recursos ?? [];
              const isOpen = seccionesAbiertas[sec.id] ?? idx === 0;
              
              return (
                <div
                  key={sec.id}
                  className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                    isDarkMode
                      ? `bg-gray-800/40 ${
                          isOpen
                            ? "border-sky-500"
                            : "border-gray-700/50 hover:border-sky-500/30"
                        }`
                      : `bg-white/60 ${
                          isOpen
                            ? "border-sky-500"
                            : "border-gray-300 hover:border-sky-500/50"
                        }`
                  }`}
                >
                  <button
                    onClick={() => toggleSeccion(sec.id)}
                    className={`w-full flex items-center justify-between p-3.5 transition-all duration-300 group ${
                      isDarkMode ? "hover:bg-gray-700/20" : "hover:bg-gray-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-fuchsia-700 rounded-lg flex items-center justify-center shadow-md shadow-sky-500/25">
                        <span className="font-bold text-white text-lg">
                          {sec.orden}
                        </span>
                      </div>
                      <div className="text-left">
                        <h4 className={`text-base font-semibold mb-0.5 group-hover:text-fuchsia-400 transition-colors ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}>
                          {sec.nombre}
                        </h4>
                        <div className="flex items-center gap-2.5 text-sm">
                          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                            {recursosOrdenados.length} clases
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <span className={`text-xs font-mono block ${
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }`}>
                          SECCIÓN
                        </span>
                        <span className="text-base font-bold text-sky-400">
                          {String(sec.orden).padStart(2, "0")}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isDarkMode 
                          ? "bg-gray-700/50 group-hover:bg-sky-500/20" 
                          : "bg-gray-200/50 group-hover:bg-sky-500/20"
                      }`}>
                        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className={`border-t ${
                      isDarkMode 
                        ? "border-gray-700/30 bg-gray-900/20" 
                        : "border-gray-300/30 bg-gray-50/30"
                    }`}>
                      {recursosOrdenados.map((clase: RecursoDto) => (
                        <div
                          key={clase.id}
                          className={`
                            flex items-center justify-between px-4 py-2.5 group transition-all duration-200
                            border-l-4
                            ${clase.estado !== "A"
                              ? "opacity-60 cursor-not-allowed border-transparent"
                              : `cursor-pointer border-transparent ${
                                  isDarkMode 
                                    ? "hover:bg-gray-700/10 hover:border-sky-500" 
                                    : "hover:bg-gray-100/30 hover:border-sky-500"
                                }`
                            }
                          `}
                          onClick={() => {
                            if (clase.estado === "A") {
                              navigate(`/cursos/${curso.id_curso}/clase/${clase.id}`);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                              {clase.estado !== "A" ? (
                                <Lock className={`w-4 h-4 ${
                                  isDarkMode ? "text-gray-500" : "text-gray-400"
                                }`} />
                              ) : (
                                <Circle className={`w-4 h-4 group-hover:text-sky-400 transition-colors ${
                                  isDarkMode ? "text-gray-500" : "text-gray-400"
                                }`} />
                              )}
                            </div>
                            <div className={`w-16 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}>
                              <PlayCircle className={`w-6 h-6 ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`} />
                            </div>
                            <div>
                              <h5 className={`font-medium text-sm mb-0.5 transition-colors ${
                                isDarkMode 
                                  ? "text-gray-300 group-hover:text-white" 
                                  : "text-gray-700 group-hover:text-gray-900"
                              }`}>
                                {clase.orden}. {clase.nombre}
                              </h5>
                              <p className={`text-xs transition-colors ${
                                isDarkMode 
                                  ? "text-gray-500 group-hover:text-gray-400" 
                                  : "text-gray-500 group-hover:text-gray-600"
                              }`}>
                                {clase.descripcion}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-sm font-medium text-cyan-400">
                              {clase.duracion_segundos
                                ? formatDuration(clase.duracion_segundos)
                                : "0m"}
                            </span>
                            <div className={`text-xs font-mono ${
                              isDarkMode ? "text-gray-500" : "text-gray-500"
                            }`}>
                              {String(clase.orden).padStart(2, "0")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <CursosComplementarios idLenguaje={curso.id_lenguaje} idCursoActual={curso.id_curso} />
        
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            className="floating-action w-14 h-14 rounded-full border border-sky-500/30 flex items-center justify-center shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300 hover:scale-110 group"
            style={{ backgroundColor: 'rgba(2, 132, 199, 0.7)' }}
          >
            <PlayCircle className="w-6 h-6 text-sky-50 group-hover:text-sky-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ruta;