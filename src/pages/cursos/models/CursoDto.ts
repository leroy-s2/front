export interface CursoDto {
  id_curso: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  estado: string;
  id_usuario: number;
  id_lenguaje: number;
  url_imagen?: string;
  total_clases?: number;
  duracion_total?: string ;
  seccions?: SeccionDto[];
}

export interface CursoSimple {
  id_curso: number;
  nombre: string;
  id_usuario: number;
  usuario: {
    nombre: string;
    recibirNotificaciones: boolean;
  };
}

export interface SeccionDto {
  id: number;
  nombre: string;
  orden: number;
  estado: string;
  recursos: RecursoDto[];
}

export interface RecursoDto {
  id: number;
  nombre: string;
  descripcion: string;
  orden: number;
  url_video: string;
  duracion_segundos: number;
  estado: string;
  id_seccion: number;
}