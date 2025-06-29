// src/context/auth/PrivateRoute.tsx
import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { authToken, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no hay token después de cargar, redirigir al login
  if (!authToken) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, renderizar el contenido
  return <>{children}</>;
};

export default PrivateRoute;