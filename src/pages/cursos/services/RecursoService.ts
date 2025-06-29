import type { ClaseTemp, ClaseBackendPayload, SasVideoResponse } from "../models/RecursoModels";

const API_URL = "http://localhost:8083/api/secciones";

/**
 * Obtiene los recursos de una sección.
 */
export async function getRecursosBySeccion(
  id_seccion: number
): Promise<ClaseTemp[]> {
  const resp = await fetch(`${API_URL}/${id_seccion}/recursos`);
  if (!resp.ok) throw new Error("No se pudo obtener recursos");
  return await resp.json();
}

/**
 * Sincroniza recursos (crear/editar/eliminar) para una sección.
 */
export async function syncRecursos(
  id_seccion: number,
  recursos: ClaseBackendPayload[],
  eliminados: number[]
) {
  const resp = await fetch(`${API_URL}/${id_seccion}/recursos/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recursos,
      eliminados,
    }),
  });
  if (!resp.ok) throw new Error("Error al sincronizar recursos");
}

/**
 * Obtiene la URL SAS de un video específico de recurso.
 * @param id_seccion El ID de la sección.
 * @param id_recurso El ID del recurso (clase).
 * @returns {Promise<SasVideoResponse>}
 */
export async function getVideoSasUrl(
  id_seccion: number,
  id_recurso: number
): Promise<SasVideoResponse> {
  const resp = await fetch(
    `${API_URL}/${id_seccion}/recursos/sas/${id_recurso}`
  );
  if (!resp.ok) throw new Error("No se pudo obtener el SAS del video");
  return resp.json();
}