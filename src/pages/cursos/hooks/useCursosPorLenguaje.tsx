import { useEffect, useState } from 'react';
import { getCursosPorLenguaje } from '../services/cursosApi';
import type { CursoSimple } from '../models/CursoDto';

export function useCursosPorLenguaje(idLenguaje: number) {
  const [data, setData] = useState<CursoSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idLenguaje) return;
    setLoading(true);
    getCursosPorLenguaje(idLenguaje)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [idLenguaje]);

  return { data, loading, error };
}