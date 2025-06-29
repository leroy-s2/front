import type { ClaseTemp } from "../../models/RecursoModels";
import type { ClaseUX } from "./ClasesPanelUXPro";

// Mapea ClaseTemp[] a ClaseUX[] para el panel visual
export function mapClaseTempToUX(clases: ClaseTemp[] | undefined): ClaseUX[] | undefined {
  if (!clases) return undefined;
  return clases.map((clase) => ({
    id: clase.id_recurso ?? clase.tempId ?? Date.now() + Math.random(),
    orden: clase.orden,
    nombre: clase.nombre,
    descripcion: clase.descripcion,
    status: clase.estado === "A" ? "Activo" : "Inactivo",
    checked: false,
    video: clase.videoFile && clase.videoBlobUrl
      ? {
          name: clase.videoFile.name,
          url: clase.videoBlobUrl,
          thumb: null, // podrías generar un thumbnail aquí
        }
      : clase.url_video
        ? {
            name: clase.url_video.split('/').pop() || "Video",
            url: clase.url_video,
            thumb: null,
          }
        : undefined,
  }));
}