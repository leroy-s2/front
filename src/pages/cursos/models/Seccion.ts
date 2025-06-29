import type { Curso } from "./Curso";


export interface Seccion {
  id_seccion: number;
  nombre: string;
  orden: number;
  estado: string;
  curso: Curso;
}