import type { Seccion } from "../models/Seccion";
import type { SeccionDTO } from "../models/SeccionModels";

const API_URL = "http://localhost:8083/api/secciones";

export const getSecciones = async (): Promise<Seccion[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener secciones");
  return res.json();
};

export const getSeccionById = async (id: number): Promise<Seccion> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener sección");
  return res.json();
};

export async function createSeccion(
  seccion: Omit<SeccionDTO, "id_seccion" | "curso">
): Promise<SeccionDTO> {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(seccion),
  });
  if (!resp.ok) throw new Error("Error al crear sección");
  return await resp.json();
}

export async function updateSeccion(
  id: number,
  seccion: Omit<SeccionDTO, "id_seccion" | "curso">
): Promise<SeccionDTO> {
  const resp = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(seccion),
  });
  if (!resp.ok) throw new Error("Error al actualizar sección");
  return await resp.json();
}

export async function deleteSeccion(id: number) {
  const resp = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!resp.ok) throw new Error("Error al eliminar sección");
}