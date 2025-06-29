import { useEffect, useState } from 'react';
import { getCursosRecientes } from '../services/cursosApi';
import type { CursoDto } from '../models/CursoDto';

export function useCursosRecientes() {
  const [data, setData] = useState<CursoDto[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCursosRecientes()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}