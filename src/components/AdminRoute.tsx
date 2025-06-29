import { Navigate } from 'react-router-dom';
import { isAdmin } from '../context/auth/utils/authUtils'; // Importar la función isAdmin

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  if (!isAdmin()) {
    // Redirigir a inicio si no es administrador
    return <Navigate to="/Inicio" replace />;
  }

  return <>{children}</>;
}