import { useState, useEffect, useCallback } from 'react';
import { ReaccionesApiService } from '../services/ReaccionesService';
import type { ReaccionResponse, ApiResponse, ReactionType } from '../types/ReactionTypes';

const useReactions = (postId: number) => {
  const [, setReacciones] = useState<ReaccionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionType, number>>({
    LIKE: 0,
    DISLIKE: 0,
    LOVE: 0,
    ANGRY: 0,
    LAUGH: 0,
  });

  const fetchReacciones = useCallback(async () => {
    setLoading(true);
    try {
      const response: ApiResponse<ReaccionResponse[]> = await ReaccionesApiService.listarReaccionesPorPublicacion(postId);
      if (response.success && response.data) {
        setReacciones(response.data);

        // Contar reacciones por tipo
        const counts: Record<ReactionType, number> = {
          LIKE: 0,
          DISLIKE: 0,
          LOVE: 0,
          ANGRY: 0,
          LAUGH: 0,
        };

        response.data.forEach((r) => {
          counts[r.tipo_reaccion]++;
        });

        setReactionCounts(counts);
      } else {
        setError(response.error || 'Error al cargar reacciones');
      }
    } catch (err) {
      setError('Error de red al cargar reacciones');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchReacciones();
  }, [fetchReacciones]);

  const toggleReaction = async (tipo: ReactionType) => {
    setLoading(true);
    try {
      const response = await ReaccionesApiService.alternarReaccion(postId, undefined, tipo);
      if (response.success) {
        await fetchReacciones();
      } else {
        setError(response.error || 'Error al alternar la reacción');
      }
    } catch (err) {
      setError('Error en toggleReaction');
    } finally {
      setLoading(false);
    }
  };

  return {
    reactions: reactionCounts,
    loading,
    error,
    toggleReaction,
  };
};

export default useReactions;
