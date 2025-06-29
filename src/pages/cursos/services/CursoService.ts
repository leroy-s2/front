import type { Curso } from "../models/Curso";
import { getToken } from '../../../context/auth/utils/authUtils';

const API_URL = "http://localhost:8083/api/cursos";

// Tipo de datos para crear/editar curso (solo lo necesario)
export type CursoPayload = {
  nombre: string;
  descripcion: string;
  estado: string;
  lenguaje: { id_lenguaje: number };
};

// Función auxiliar para crear headers con autenticación
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

export const getCursos = async (): Promise<Curso[]> => {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener cursos");
  return res.json();
};

export const getCursoById = async (id: number): Promise<Curso> => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener curso");
  return res.json();
};

export const createCurso = async (data: CursoPayload): Promise<Curso> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear curso");
  return res.json();
};

export const updateCurso = async (id: number, data: CursoPayload): Promise<Curso> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar curso");
  return res.json();
};

export const deleteCurso = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { 
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar curso");
};