import type { CursoDetalleDto } from "../models/CursoDetalleDto";

const API = "http://localhost:8083/api";

export const getCursoDetalle = async (idCurso: number): Promise<CursoDetalleDto> => {
  const res = await fetch(`${API}/cursos/${idCurso}`);
  if (!res.ok) throw new Error("Error cargando detalle del curso");
  return res.json();
};