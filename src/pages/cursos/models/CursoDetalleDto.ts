export interface CursoDetalleDto {
  id_curso: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  url_imagen?: string;
  total_clases?: number;
  duracion_total?: string;
  id_usuario: number;
  seccions: SeccionDetalleDto[];
}

export interface SeccionDetalleDto {
  id_seccion: number;
  nombre: string;
  orden: number;
  estado: string;
  id_curso: number;
  recursos: RecursoDetalleDto[];
}

export interface RecursoDetalleDto {
  id_recurso: number;
  nombre: string;
  descripcion: string;
  estado: string;
  url_video?: string;
  orden: number;
  id_seccion: number;
  duracion_segundos?: number;
}