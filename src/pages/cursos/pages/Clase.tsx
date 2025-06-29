import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Lock, Play, PlayCircle, ChevronLeft } from "lucide-react";
import { useCursoDetalle } from "../hooks/useCursoDetalle";
import { getVideoSasUrl } from "../services/RecursoService";
import { useTheme } from "../../../context/theme/ThemeContext";
import type { SeccionDto, RecursoDto } from "../models/CursoDto";

const formatDuration = (seconds: number = 0) => {
  const min = Math.floor(seconds / 60);
  return `${min}m`;
};

const Clase: React.FC = () => {
  const { id_curso, id_recurso } = useParams<{ id_curso: string; id_recurso: string }>();
  const idCursoNum = Number(id_curso);
  const idRecursoNum = Number(id_recurso);

  const { curso, loading, error } = useCursoDetalle(idCursoNum);
  const { isDarkMode } = useTheme();

  const [seccionesAbiertas, setSeccionesAbiertas] = useState<Record<number, boolean>>({});
  const [videoSasUrl, setVideoSasUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  // Crear lista ordenada de todos los recursos para navegación
  const recursosOrdenados = useMemo(() => {
    if (!curso) return [];
    
    const recursos: Array<{ recurso: RecursoDto; seccion: SeccionDto }> = [];
    
    // Las secciones ya vienen ordenadas del hook
    curso.seccions?.forEach((seccion) => {
      // Los recursos ya vienen ordenados del hook
      seccion.recursos.forEach((recurso) => {
        recursos.push({ recurso, seccion });
      });
    });
    
    return recursos;
  }, [curso]);

  // Encontrar índice actual y calcular siguiente/anterior
  const { indiceActual, recursoAnterior, recursoSiguiente } = useMemo(() => {
    const indice = recursosOrdenados.findIndex(item => item.recurso.id === idRecursoNum);
    return {
      indiceActual: indice,
      recursoAnterior: indice > 0 ? recursosOrdenados[indice - 1] : null,
      recursoSiguiente: indice < recursosOrdenados.length - 1 ? recursosOrdenados[indice + 1] : null,
    };
  }, [recursosOrdenados, idRecursoNum]);

  // Abrir sección donde está la clase actual
  useEffect(() => {
    if (!curso) return;
    const found = curso.seccions?.find((sec: SeccionDto) =>
      sec.recursos.some((r: RecursoDto) => r.id === idRecursoNum)
    );
    if (found) {
      setSeccionesAbiertas((prev) => ({
        ...prev,
        [found.id]: true,
      }));
    }
  }, [curso, idRecursoNum]);

  // Buscar recurso actual y sección actual
  const { recursoActual, seccionActual } = useMemo(() => {
    if (!curso) return { recursoActual: undefined, seccionActual: undefined };
    for (const sec of curso.seccions ?? []) {
      const recurso = sec.recursos.find((r: RecursoDto) => r.id === idRecursoNum);
      if (recurso) return { recursoActual: recurso, seccionActual: sec };
    }
    return { recursoActual: undefined, seccionActual: undefined };
  }, [curso, idRecursoNum]);

  // Si cambia de curso, cerrar todo
  useEffect(() => {
    setSeccionesAbiertas({});
  }, [idCursoNum]);

  // Cambiar de clase
  const handleChangeClase = (nuevo: { id_recurso: number }) => {
    if (!curso) return;
    navigate(`/cursos/${curso.id_curso}/clase/${nuevo.id_recurso}`);
  };

  // Navegación anterior/siguiente
  const irAClaseAnterior = () => {
    if (recursoAnterior) {
      handleChangeClase({ id_recurso: recursoAnterior.recurso.id });
    }
  };

  const irAClaseSiguiente = () => {
    if (recursoSiguiente) {
      handleChangeClase({ id_recurso: recursoSiguiente.recurso.id });
    }
  };

  // Pedir la URL SAS del recurso actual
  useEffect(() => {
    setVideoSasUrl(null);
    if (!recursoActual?.id_seccion || !recursoActual?.id) return;
    getVideoSasUrl(recursoActual.id_seccion, recursoActual.id)
      .then(data => setVideoSasUrl(data.sas_url))
      .catch(() => setVideoSasUrl(null));
  }, [recursoActual]);

  if (loading) return (
    <div className={`p-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      Cargando...
    </div>
  );
  
  if (error || !curso || !recursoActual || !seccionActual)
    return (
      <div className={`p-8 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
        No se pudo cargar la clase
      </div>
    );

  return (
    <div className={`min-h-screen py-8 px-4 flex flex-col items-center ${
      isDarkMode ? "bg-gray-900" : "bg-blue-50"
    }`}>
      <div className="w-full max-w-7xl flex gap-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col pr-2 min-w-0">
          {/* Video */}
          <div
            className={`rounded-2xl overflow-hidden mb-7 flex items-center justify-center ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              minHeight: 420,
              height: 430,
              boxShadow: isDarkMode ? "0 4px 32px rgba(0,0,0,0.3)" : "0 4px 32px rgba(0,0,0,0.1)",
              padding: "20px 24px 20px 20px",
            }}
          >
            {videoSasUrl ? (
              <video
                controls
                className="w-full h-full rounded-2xl bg-black"
                style={{ maxHeight: 400, background: "#000" }}
                src={videoSasUrl}
                poster={curso.url_imagen}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <PlayCircle className={`w-24 h-24 mb-2 ${
                  isDarkMode ? "text-gray-600" : "text-gray-400"
                }`} />
                <div className={`text-lg ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  Cargando video...
                </div>
              </div>
            )}
          </div>

          {/* Información del curso y clase */}
          <div className="text-purple-400 text-base font-semibold mb-1">{curso.nombre}</div>
          <div className={`text-2xl font-bold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            {recursoActual.orden}. {recursoActual.nombre}
          </div>
          <div className={`rounded-xl p-5 mb-8 leading-relaxed text-[1.08rem] ${
            isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
          }`}>
            {recursoActual.descripcion}
          </div>

          {/* Controles de navegación */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={irAClaseAnterior}
              disabled={!recursoAnterior}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                !recursoAnterior
                  ? "opacity-50 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">
                {recursoAnterior ? `${recursoAnterior.recurso.orden}. ${recursoAnterior.recurso.nombre}` : "Anterior"}
              </span>
            </button>

            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Clase {indiceActual + 1} de {recursosOrdenados.length}
            </div>

            <button
              onClick={irAClaseSiguiente}
              disabled={!recursoSiguiente}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                !recursoSiguiente
                  ? "opacity-50 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span className="text-sm">
                {recursoSiguiente ? `${recursoSiguiente.recurso.orden}. ${recursoSiguiente.recurso.nombre}` : "Siguiente"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Sidebar: Temario */}
        <aside className="w-[305px] min-h-[380px] flex flex-col">
          <div
            className={`rounded-2xl border flex flex-col ${
              isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
            }`}
            style={{
              minHeight: 320,
              maxHeight: 500,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div className={`px-3 pt-3 pb-2 border-b flex items-center ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            }`}>
              <button className={`rounded transition p-0.5 mr-2 ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`} tabIndex={-1}>
                <ChevronRight className={`w-3.5 h-3.5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`} />
              </button>
              <span className={`font-semibold text-[0.85rem] uppercase tracking-wide ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`} style={{ fontFamily: "'Inter', 'Space Grotesk', Arial, sans-serif" }}>
                Temario
              </span>
            </div>
            
            {/* Lista de secciones */}
            <div
              className="sidebar-scroll px-1.5 py-1.5"
              style={{
                flex: 1,
                minHeight: 0,
                maxHeight: 340,
                overflowY: "auto"
              }}
            >
              {(curso.seccions ?? []).map((section: SeccionDto) => (
                <div
                  key={section.id}
                  className={`mb-1 rounded-[7px] border overflow-hidden ${
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                  } ${section.id === seccionActual.id ? "border-purple-400" : ""}`}
                  style={{
                    fontFamily: "'Inter', 'Space Grotesk', Arial, sans-serif",
                    fontSize: "0.78rem",
                  }}
                >
                  <button
                    onClick={() => setSeccionesAbiertas((prev) => ({
                      ...prev,
                      [section.id]: !prev[section.id],
                    }))}
                    className={`w-full flex items-center justify-between px-3 py-1.5 group transition-all ${
                      isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                    }`}
                    style={{
                      fontWeight: 500,
                      fontSize: "0.80rem",
                      letterSpacing: "0.01em",
                      fontFamily: "'Inter', 'Space Grotesk', Arial, sans-serif"
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Lock className={`w-[12px] h-[12px] mr-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`} />
                      <span className={`truncate ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {`${section.orden}. ${section.nombre}`}
                      </span>
                    </div>
                    <span>
                      {seccionesAbiertas[section.id] ? (
                        <ChevronDown className="w-3 h-3 text-blue-400" />
                      ) : (
                        <ChevronRight className={`w-3 h-3 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`} />
                      )}
                    </span>
                  </button>
                  
                  {/* Clases de la sección */}
                  {seccionesAbiertas[section.id] && section.recursos.length > 0 && (
                    <div className="flex flex-col pt-0.5 pb-1.5">
                      {section.recursos.map((lesson: RecursoDto) => (
                        <button
                          key={lesson.id}
                          className={`
                            flex items-center gap-2 px-4 py-1 w-full text-left rounded group
                            ${lesson.id === recursoActual.id 
                              ? (isDarkMode ? "bg-gray-600" : "bg-gray-100")
                              : (isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100")
                            }
                            ${lesson.estado !== "A" ? "opacity-60 cursor-not-allowed" : ""}
                          `}
                          disabled={lesson.estado !== "A"}
                          onClick={() => handleChangeClase({ id_recurso: lesson.id })}
                        >
                          {/* Thumbnail tipo player */}
                          <span className={`flex items-center justify-center w-7 h-6 rounded-[6px] mr-1 ${
                            isDarkMode ? "bg-gray-600" : "bg-gray-200"
                          }`}>
                            <Play className={`w-3.5 h-3.5 ${
                              lesson.id === recursoActual.id 
                                ? "text-purple-400" 
                                : (isDarkMode ? "text-gray-400" : "text-gray-600")
                            }`} />
                          </span>
                          
                          {/* Nombre y duración */}
                          <div className="flex-1 flex items-center justify-between">
                            <span className={`font-medium truncate text-[0.90rem] ${
                              lesson.id === recursoActual.id 
                                ? "text-purple-400" 
                                : (isDarkMode ? "text-white" : "text-gray-900")
                            }`}>
                              {lesson.orden}. {lesson.nombre}
                            </span>
                            <span className="ml-3 text-[11px] text-purple-400 font-semibold">
                              {formatDuration(lesson.duracion_segundos)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <style>{`
              .sidebar-scroll {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .sidebar-scroll::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
          
          {/* Premium CTA */}
          <div className="p-0 border-0 mt-4 flex-0">
            <div className={`rounded-xl p-4 text-center shadow-md border ${
              isDarkMode 
                ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 text-white" 
                : "bg-gradient-to-r from-gray-50 to-white border-gray-200 text-gray-900"
            }`}>
              <div className={`font-semibold mb-1 text-[0.97rem] ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Desbloquea todo el contenido
              </div>
              <div className="text-xs text-purple-400 mb-3">
                Accede a recursos premium, descarga materiales, soporte prioritario y certificados exclusivos.
              </div>
              <button 
                className={`w-full flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg border transition-all text-[0.96rem] shadow-sm ${
                  isDarkMode
                    ? "bg-gradient-to-r from-gray-700 to-gray-600 text-blue-400 border-gray-500 hover:from-gray-600 hover:to-gray-500"
                    : "bg-gradient-to-r from-white to-gray-50 text-blue-600 border-gray-300 hover:from-gray-50 hover:to-gray-100"
                }`}
                style={{
                  letterSpacing: ".01em"
                }}
              >
                <svg className="mr-1" fill="none" width={18} height={18} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 4v16m0 0l-5-5m5 5l5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Actualizar a Premium
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Clase;