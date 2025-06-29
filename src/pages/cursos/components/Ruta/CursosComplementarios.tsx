import React, { useRef, useEffect, useState } from "react";
import { getCursosPorLenguaje } from "../.././services/cursosApi";

interface UsuarioDto {
  nombre: string;
  recibirNotificaciones: boolean;
}

export interface CursoLenguajeDto {
  id_curso: number;
  nombre: string;
  id_usuario?: number;
  usuario?: UsuarioDto;
}

interface CursosComplementariosProps {
  idLenguaje: number;
  idCursoActual: number;
}

interface CursoComplementarioCard {
  id: number;
  nombre: string;
  instructor: string;
  destacado: boolean;
}

const CARD_WIDTH = 275;
const CARD_HEIGHT = 187;
const IMAGE_HEIGHT = Math.round(CARD_HEIGHT * 0.75);
const CARD_GAP = 16;
const VISIBLE_CARDS = 4;
const visibleWidth = CARD_WIDTH * VISIBLE_CARDS + CARD_GAP * (VISIBLE_CARDS - 1);

const CursosComplementarios: React.FC<CursosComplementariosProps> = ({
  idLenguaje,
  idCursoActual,
}) => {
  const [cursos, setCursos] = useState<CursoComplementarioCard[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getCursosPorLenguaje(idLenguaje)
      .then((data: CursoLenguajeDto[]) => {
        // Filtra fuera el curso actual
        const otros = data.filter((c) => c.id_curso !== idCursoActual);
        // Adapta la estructura mínima
        setCursos(
          otros.map((c) => ({
            id: c.id_curso,
            nombre: c.nombre,
            instructor: c.usuario?.nombre || "Instructor Desconocido",
            destacado: true, // O lógica si tienes campo para esto
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [idLenguaje, idCursoActual]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = CARD_WIDTH + CARD_GAP;
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (loading)
    return (
      <div className="text-white p-4">Cargando cursos complementarios...</div>
    );

  if (!cursos.length)
    return (
      <div className="text-gray-400 p-4">
        No hay otros cursos en este lenguaje disponibles.
      </div>
    );

  return (
    <div className="bg-gray-900 py-5 px-1 md:px-4">
      <div className="w-full flex justify-center">
        <div style={{ maxWidth: `${visibleWidth}px`, width: "100%" }}>
          <div className="flex justify-between items-center mb-2 px-2" style={{ width: "100%" }}>
            <h2 className="text-[1.18rem] font-extrabold text-white" style={{ letterSpacing: "-0.5px" }}>
              Complementa este curso con estos otros
            </h2>
            <button className="text-sky-400 hover:text-fuchsia-400 hover:underline text-sm font-medium transition-colors duration-200">
              Ver todos
            </button>
          </div>
          <div className="relative flex items-center w-full">
            {/* Flecha izquierda */}
            <button
              className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#23283a] hover:bg-cyan-200/80 transition border border-gray-700 rounded-full w-7 h-7 shadow"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              type="button"
              style={{ boxShadow: "0 2px 8px #0003" }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" className="text-cyan-400">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Carrusel cursos */}
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-1"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                maxWidth: `${visibleWidth}px`,
                width: "100%"
              }}
            >
              {cursos.map((curso) => (
                <div
                  key={curso.id}
                  style={{
                    minWidth: `${CARD_WIDTH}px`,
                    maxWidth: `${CARD_WIDTH}px`,
                    height: `${CARD_HEIGHT}px`,
                    background: "#181f2c",
                    border: "2px solid #27e1ff30",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    overflow: "hidden"
                  }}
                  className="snap-center shadow-sm hover:shadow-lg hover:border-cyan-400/90 transition-all duration-300 mx-0 z-10"
                >
                  {/* Parte superior (imagen/fondo) */}
                  <div
                    className="relative w-full flex items-start justify-between px-3 pt-2 pb-1 overflow-hidden rounded-t-xl"
                    style={{
                      height: `${IMAGE_HEIGHT}px`,
                      background: "#d1d5db"
                    }}
                  >
                    {curso.destacado && (
                      <span
                        className="absolute top-2 right-2 px-2.5 py-0.5 text-[11px] font-bold rounded-lg"
                        style={{
                          background: 'linear-gradient(90deg, #00ffe7 0%, #00c3ff 100%)',
                          color: '#131c23',
                          fontWeight: 700,
                          textAlign: 'center'
                        }}
                      >
                        CodingShare
                      </span>
                    )}
                    <span className="mx-auto text-gray-500 text-[15px] font-semibold select-none z-0" style={{ marginTop: 20 }}>
                      400×225
                    </span>
                  </div>
                  {/* Info principal rectangular abajo */}
                  <div
                    className="flex flex-col justify-center px-3 pb-1 pt-1 min-h-[30px] bg-[#151d29] border border-cyan-400/20 rounded-b-xl"
                    style={{
                      width: "100%"
                    }}
                  >
                    <div
                      className="text-[0.85rem] font-semibold leading-tight text-white"
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        overflow: "visible",
                        display: "block",
                        lineHeight: 1.1,
                        minHeight: "16px"
                      }}
                      title={curso.nombre}
                    >
                      {curso.nombre}
                    </div>
                    <p
                      className="text-[0.73rem] text-gray-400"
                      style={{
                        margin: 0,
                        lineHeight: 1.1,
                        minHeight: "12px"
                      }}
                      title={curso.instructor}
                    >
                      {curso.instructor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Flecha derecha */}
            <button
              className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#23283a] hover:bg-fuchsia-200/90 transition border border-gray-700 rounded-full w-7 h-7 shadow"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              type="button"
              style={{ boxShadow: "0 2px 8px #0003" }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" className="text-fuchsia-400">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursosComplementarios;