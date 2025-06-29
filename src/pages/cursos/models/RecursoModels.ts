// Ejemplo mínimo de ClaseTemp para referencia
export type ClaseTemp = {
  tempId?: number;
  id_recurso?: number;
  nombre: string;
  descripcion: string;
  estado: "A" | "I";
  orden: number;
  url_video?: string; // URL remota (Azure, S3, etc)
  duracion_segundos?: number;

  // Campos solo frontend:
  videoFile?: File;          // Si el usuario sube/cambia un video
  videoBlobUrl?: string;     // Para preview local si hay videoFile
};

// Payload para el backend (sin tempId, ni videoFile ni videoUrlLocal)
export type ClaseBackendPayload = {
  id_recurso?: number;
  nombre: string;
  descripcion: string;
  estado: "A" | "I";
  url_video?: string;
  orden: number;
  duracion_segundos?: number;
};

export interface SasVideoResponse {
  sas_url: string;
}