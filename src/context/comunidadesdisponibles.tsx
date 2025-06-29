// 3. Arreglo para CommunityFilterProvider - Evitar bucles infinitos
import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';
import { useApiRequest } from '../services/servicecomunidad';
import type { Community } from '../services/servicecomunidad';
import { getCommunities } from '../services/Comunidadporusuario';
import type { UserCommunity } from '../models/UserCommunity';

interface CommunityFilterContextType {
  availableCommunities: Community[];
  joinedCommunities: UserCommunity[];
  loading: boolean;
  error: string | null;
  getAvailableCommunities: () => Promise<void>;
  searchAvailableCommunities: (query: string) => Promise<Community[]>;
  refreshCommunities: () => Promise<void>;
  clearError: () => void;
}

const CommunityFilterContext = createContext<CommunityFilterContextType | undefined>(undefined);

export const useCommunityFilter = () => {
  const context = useContext(CommunityFilterContext);
  if (!context) {
    throw new Error('useCommunityFilter debe ser usado dentro de CommunityFilterProvider');
  }
  return context;
};

interface CommunityFilterProviderProps {
  children: React.ReactNode;
}

export const CommunityFilterProvider: React.FC<CommunityFilterProviderProps> = ({ children }) => {
  const { getComunidades, buscarComunidadesPorNombre, loading: apiLoading, error: apiError } = useApiRequest();
  
  const [availableCommunities, setAvailableCommunities] = useState<Community[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<UserCommunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs para evitar múltiples llamadas
  const isLoadingRef = useRef(false);
  const lastLoadTime = useRef<number>(0);
  const CACHE_DURATION = 30000; // 30 segundos de cache

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const safeGetCommunities = useCallback(async (): Promise<UserCommunity[]> => {
    try {
      const communities = await getCommunities();
      return Array.isArray(communities) ? communities : [];
    } catch (err: any) {
      console.warn('Error al obtener comunidades del usuario:', err);
      return [];
    }
  }, []);

  const filterAvailableCommunities = useCallback(
  (allCommunities: Community[], userCommunities: UserCommunity[]): Community[] => {
    try {
      const joinedCommunityIds = new Set(
        userCommunities.map(uc => {
          if (typeof uc.comunidad === 'object' && uc.comunidad?.id) {
            return uc.comunidad.id;
          }
          return typeof uc.comunidad === 'number' ? uc.comunidad : null;
        }).filter(id => id !== null)
      );
      
      return allCommunities.filter(community => 
        community && community.id && 
        !joinedCommunityIds.has(community.id) &&  // Filtro de comunidad no unida
        community.estado !== 0  // Filtro para excluir comunidades inactivas (estado 0)
      );
    } catch (err) {
      console.error('Error al filtrar comunidades:', err);
      return allCommunities;
    }
  },
  []
);


  const getAvailableCommunities = useCallback(async () => {
    const now = Date.now();
    
    // Evitar llamadas muy frecuentes
    if (isLoadingRef.current || (now - lastLoadTime.current < CACHE_DURATION)) {
      return;
    }

    isLoadingRef.current = true;
    lastLoadTime.current = now;
    setLoading(true);
    setError(null);

    try {
      const [allCommunitiesResult, userCommunitiesResult] = await Promise.allSettled([
        getComunidades(),
        safeGetCommunities()
      ]);

      let allCommunities: Community[] = [];
      let userCommunities: UserCommunity[] = [];

      if (allCommunitiesResult.status === 'fulfilled') {
        allCommunities = allCommunitiesResult.value;
      } else {
        console.error('Error al obtener todas las comunidades:', allCommunitiesResult.reason);
        throw new Error('Error al obtener las comunidades disponibles');
      }

      if (userCommunitiesResult.status === 'fulfilled') {
        userCommunities = userCommunitiesResult.value;
      } else {
        console.warn('Error al obtener comunidades del usuario:', userCommunitiesResult.reason);
        userCommunities = [];
      }

      const filtered = filterAvailableCommunities(allCommunities, userCommunities);
      
      setAvailableCommunities(filtered);
      setJoinedCommunities(userCommunities);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener las comunidades';
      setError(errorMessage);
      console.error('Error en getAvailableCommunities:', err);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [getComunidades, safeGetCommunities, filterAvailableCommunities]);

  const searchAvailableCommunities = useCallback(async (query: string): Promise<Community[]> => {
    if (!query.trim()) {
      return availableCommunities;
    }

    setLoading(true);
    setError(null);

    try {
      const [searchResult, userCommunitiesResult] = await Promise.allSettled([
        buscarComunidadesPorNombre(query),
        safeGetCommunities()
      ]);

      let searchResults: Community[] = [];
      let userCommunities: UserCommunity[] = [];

      if (searchResult.status === 'fulfilled') {
        searchResults = searchResult.value;
      } else {
        console.error('Error en búsqueda:', searchResult.reason);
        throw new Error('Error al buscar comunidades');
      }

      if (userCommunitiesResult.status === 'fulfilled') {
        userCommunities = userCommunitiesResult.value;
      } else {
        userCommunities = joinedCommunities;
      }

      const filteredResults = filterAvailableCommunities(searchResults, userCommunities);
      return filteredResults;
      
    } catch (err: any) {
      const errorMessage = err.message || 'Error al buscar comunidades';
      setError(errorMessage);
      console.error('Error en searchAvailableCommunities:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [buscarComunidadesPorNombre, safeGetCommunities, filterAvailableCommunities, availableCommunities, joinedCommunities]);

  const refreshCommunities = useCallback(async () => {
    // Forzar actualización reseteando el cache
    lastLoadTime.current = 0;
    await getAvailableCommunities();
  }, [getAvailableCommunities]);

  // Usar useMemo para evitar recreación innecesaria del valor del contexto
  const contextValue = useMemo(() => ({
    availableCommunities,
    joinedCommunities,
    loading: loading || apiLoading,
    error: error || apiError,
    getAvailableCommunities,
    searchAvailableCommunities,
    refreshCommunities,
    clearError,
  }), [
    availableCommunities,
    joinedCommunities,
    loading,
    apiLoading,
    error,
    apiError,
    getAvailableCommunities,
    searchAvailableCommunities,
    refreshCommunities,
    clearError,
  ]);

  return (
    <CommunityFilterContext.Provider value={contextValue}>
      {children}
    </CommunityFilterContext.Provider>
  );
};