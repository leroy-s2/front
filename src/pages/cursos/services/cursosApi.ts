import type { LenguajeDto } from '../models/LenguajeDto';
import type { CursoDto } from '../models/CursoDto';
import type { CursoSimple } from '../models/CursoDto';

const API = 'http://localhost:8083/api';

export const getLenguajesActivos = async (): Promise<LenguajeDto[]> => {
  const res = await fetch(`${API}/lenguajes/activos`);
  if (!res.ok) throw new Error('Error cargando lenguajes');
  return res.json();
};

export const getCursosPorLenguaje = async (idLenguaje: number): Promise<CursoSimple[]> => {
  const res = await fetch(`${API}/lenguajes/${idLenguaje}/cursos`);
  if (!res.ok) throw new Error('Error cargando cursos');
  return res.json();
};

export const getCursosRecientes = async (): Promise<CursoDto[]> => {
  const res = await fetch(`${API}/cursos/recientes`);
  if (!res.ok) throw new Error('Error cargando cursos recientes');
  return res.json();
};

export const getCursoDetalle = async (idCurso: number): Promise<CursoDto> => {
  const res = await fetch(`${API}/cursos/${idCurso}`);
  if (!res.ok) throw new Error('Error cargando detalle del curso');
  return res.json();
};