import { useEffect, useState } from 'react';
import { getLenguajesActivos } from '../services/cursosApi';
import type { LenguajeDto } from '../models/LenguajeDto';

export function useLenguajes() {
  const [data, setData] = useState<LenguajeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLenguajesActivos()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}