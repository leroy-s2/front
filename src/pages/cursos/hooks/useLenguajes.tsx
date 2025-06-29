import { useEffect, useState } from "react";
import type { Lenguaje } from "../models/Lenguaje";
import {
  getLenguajes,
  createLenguaje,
  updateLenguaje,
  deleteLenguaje,
} from "../services/LenguajeService";

export function useLenguajes() {
  const [lenguajes, setLenguajes] = useState<Lenguaje[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLenguajes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLenguajes();
      setLenguajes(data);
    } catch  {
      setError("Error al obtener los lenguajes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLenguajes();
  }, []);

  const addLenguaje = async (data: Omit<Lenguaje, "id_lenguaje">) => {
    setLoading(true);
    setError(null);
    try {
      const nuevo = await createLenguaje(data);
      setLenguajes((prev) => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      setError("Error al agregar lenguaje.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editLenguaje = async (id: number, data: Omit<Lenguaje, "id_lenguaje">) => {
    setLoading(true);
    setError(null);
    try {
      const actualizado = await updateLenguaje(id, data);
      setLenguajes((prev) =>
        prev.map((l) => (l.id_lenguaje === id ? actualizado : l))
      );
      return actualizado;
    } catch (err) {
      setError("Error al editar lenguaje.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeLenguaje = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteLenguaje(id);
      setLenguajes((prev) => prev.filter((l) => l.id_lenguaje !== id));
    } catch (err) {
      setError("Error al eliminar lenguaje.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    lenguajes,
    loading,
    error,
    fetchLenguajes,
    addLenguaje,
    editLenguaje,
    removeLenguaje,
  };
}