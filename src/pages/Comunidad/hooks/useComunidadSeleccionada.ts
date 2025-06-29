import React, { createContext, useContext, useState } from 'react';
import type { Community } from "../../inicio/models/Community";

interface CommunityContextType {
  comunidadSeleccionada: Community | null;
  setComunidad: (comunidad: Community) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState<Community | null>(null);

  const setComunidad = (comunidad: Community) => {
    setComunidadSeleccionada(comunidad);
  };

  return React.createElement(
    CommunityContext.Provider,
    { 
      value: { 
        comunidadSeleccionada, 
        setComunidad 
      } 
    },
    children
  );
}

export function useComunidadSeleccionada() {
  const context = useContext(CommunityContext);
  
  if (context === undefined) {
    throw new Error('useComunidadSeleccionada debe ser usado dentro de un CommunityProvider');
  }
  
  return context;
}