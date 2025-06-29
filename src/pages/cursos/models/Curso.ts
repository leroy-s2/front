import type { Lenguaje } from "./Lenguaje";

export interface Curso {
  id_curso: number;
  nombre: string;
  descripcion: string;
  fechaCreacion?: string; // Ya no es requerido para crear ni editar
  estado: string;
  idUsuario?: number;     // Ya no es requerido para crear ni editar
  lenguaje: Lenguaje;
}