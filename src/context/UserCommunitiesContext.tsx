import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCommunities } from "../services/Comunidadporusuario";
import { getToken } from "../context/auth/utils/authUtils";
import type { UserCommunity } from "../models/UserCommunity";

interface CommunityContextType {
  userCommunities: UserCommunity[];
  refreshCommunities: () => Promise<void>;
  addCommunity: (community: UserCommunity) => void;
  removeCommunity: (communityId: number) => void;
  isLoading: boolean;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) throw new Error("useCommunity must be used within a CommunityProvider");
  return context;
};

export const CommunityProvider = ({ children }: { children: React.ReactNode }) => {
  const [userCommunities, setUserCommunities] = useState<UserCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCommunities = useCallback(async () => {
    const token = getToken();
    
    // Si no hay token, limpia las comunidades y no hagas la petición
    if (!token) {
      setUserCommunities([]);
      return;
    }

    setIsLoading(true);
    try {
      const communities = await getCommunities();
      setUserCommunities(communities);
    } catch (error) {
      console.error('Error fetching communities:', error);
      setUserCommunities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCommunity = (community: UserCommunity) => {
    setUserCommunities((prev) => [...prev, community]);
  };

  const removeCommunity = (communityId: number) => {
    setUserCommunities((prev) => prev.filter((community) => community.comunidad.id !== communityId));
  };

  // Efecto que escucha cambios en el localStorage (cuando se guarda/elimina el token)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchCommunities();
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar un evento personalizado para cambios de autenticación
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, [fetchCommunities]);

  // Efecto inicial para cargar comunidades al montar el componente
  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  // Verificar periódicamente si hay token (útil para cuando el usuario inicia sesión)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getToken();
      if (token && userCommunities.length === 0 && !isLoading) {
        fetchCommunities();
      }
    }, 1000); // Verificar cada segundo

    return () => clearInterval(interval);
  }, [userCommunities.length, isLoading, fetchCommunities]);

  return (
    <CommunityContext.Provider 
      value={{ 
        userCommunities, 
        refreshCommunities: fetchCommunities, 
        addCommunity, 
        removeCommunity,
        isLoading 
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};