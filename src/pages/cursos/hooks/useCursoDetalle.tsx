import { useEffect, useState } from "react";
import { getCursoDetalle } from "../services/RutaService";
import type { CursoDto, SeccionDto, RecursoDto } from "../models/CursoDto";
import type { CursoDetalleDto, SeccionDetalleDto, RecursoDetalleDto } from "../models/CursoDetalleDto";

// Convierte el DTO de detalle a DTO estándar del frontend
function adaptCursoDetalle(dto: CursoDetalleDto): CursoDto {
  return {
    id_curso: dto.id_curso,
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    fecha_creacion: dto.fecha_creacion,
    estado: "A",
    id_usuario: dto.id_usuario,
    id_lenguaje: 1,
    url_imagen: dto.url_imagen,
    total_clases: dto.total_clases,
    duracion_total: dto.duracion_total,
    seccions: dto.seccions
      .sort((a: SeccionDetalleDto, b: SeccionDetalleDto) => a.orden - b.orden) // Ordenar secciones
      .map((sec: SeccionDetalleDto): SeccionDto => ({
        id: sec.id_seccion,
        nombre: sec.nombre,
        orden: sec.orden,
        estado: sec.estado,
        recursos: sec.recursos
          .sort((a: RecursoDetalleDto, b: RecursoDetalleDto) => a.orden - b.orden) // Ordenar recursos
          .map((r: RecursoDetalleDto): RecursoDto => ({
            id: r.id_recurso,
            nombre: r.nombre,
            descripcion: r.descripcion,
            orden: r.orden,
            url_video: r.url_video || "",
            duracion_segundos: r.duracion_segundos ?? 0,
            estado: r.estado,
            id_seccion: sec.id_seccion,
          })),
      })),
  };
}

export function useCursoDetalle(idCurso: number) {
  const [curso, setCurso] = useState<CursoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setCurso(null);
    getCursoDetalle(idCurso)
      .then((data: CursoDetalleDto) => {
        setCurso(adaptCursoDetalle(data));
        setError(null);
      })
      .catch(() => setError("Error al cargar el curso"))
      .finally(() => setLoading(false));
  }, [idCurso]);

  return { curso, loading, error };
}