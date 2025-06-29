import { useEffect, useState, useCallback } from "react";
import { getSecciones } from "../services/SeccionService";
import type { Seccion } from "../models/Seccion";

export function useSecciones() {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSecciones();
      setSecciones(data);
    } catch  {
      setError("Error al cargar secciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecciones();
  }, [fetchSecciones]);

  return { secciones, loading, error, fetchSecciones };
}