import type { Lenguaje } from "../models/Lenguaje";

const API_URL = "http://localhost:8083/api/lenguajes";

export const getLenguajes = async (): Promise<Lenguaje[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener lenguajes");
  return res.json();
};

export const createLenguaje = async (data: Omit<Lenguaje, "id_lenguaje">): Promise<Lenguaje> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear lenguaje");
  return res.json();
};

export const updateLenguaje = async (id: number, data: Omit<Lenguaje, "id_lenguaje">): Promise<Lenguaje> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar lenguaje");
  return res.json();
};

export const deleteLenguaje = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar lenguaje");
};