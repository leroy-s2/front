import { useEffect, useState } from "react";
import type { Curso } from "../models/Curso";
import {
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso,
} from "../services/CursoService";

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCursos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCursos();
      setCursos(data);
    } catch  {
      setError("Error al obtener cursos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const addCurso = async (data: Omit<Curso, "id_curso">) => {
    setLoading(true);
    setError(null);
    try {
      const nuevo = await createCurso(data);
      setCursos((prev) => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      setError("Error al agregar curso.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editCurso = async (id: number, data: Omit<Curso, "id_curso">) => {
    setLoading(true);
    setError(null);
    try {
      const actualizado = await updateCurso(id, data);
      setCursos((prev) =>
        prev.map((c) => (c.id_curso === id ? actualizado : c))
      );
      return actualizado;
    } catch (err) {
      setError("Error al editar curso.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCurso = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCurso(id);
      setCursos((prev) => prev.filter((c) => c.id_curso !== id));
    } catch (err) {
      setError("Error al eliminar curso.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cursos,
    loading,
    error,
    fetchCursos,
    addCurso,
    editCurso,
    removeCurso,
  };
}