// models/Curso.ts

export interface Lenguaje {
  idLenguaje: number;
  nombre: string;
  estado: string;
}

export interface Curso {
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
  horas: number;
  estado: string;
  idUsuario: number | null;
  lenguaje: Lenguaje;
}
