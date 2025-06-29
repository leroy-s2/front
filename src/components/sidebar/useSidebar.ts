// useSidebar.ts
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useSidebar() {
  const location = useLocation();
  const [communityOpen, setCommunityOpen] = useState(false);

  // Abre automáticamente el menú "Comunidad" si la ruta empieza con "/comunidad"
  useEffect(() => {
    if (location.pathname.startsWith('/comunidades')) {
      setCommunityOpen(true);
    }
  }, [location.pathname]);

  // Retorna true si la ruta actual es exactamente igual o una subruta de la ruta base
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return {
    communityOpen,
    setCommunityOpen,
    isActive,
  };
}
