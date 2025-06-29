import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Topbar } from "./components/Topbat/Topbar";
import { ThemeProvider, useTheme } from "./context/theme/ThemeContext";
import { CommunityProvider as ComunidadSeleccionadaProvider } from "./pages/Comunidad/hooks/useComunidadSeleccionada"; 
import { CommunityProvider as UserCommunitiesProvider } from "./context/UserCommunitiesContext";
import { CommunityFilterProvider } from "./context/comunidadesdisponibles";
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

import { ContentInicio } from "./pages/inicio/pages/ContentInicio";
import { ComunidadesDisponibles } from "./pages/inicio/pages/ComunidadesDisponibles";
import { DetalleNoticia } from "./pages/inicio/pages/DetalleNoticia";

import { ContentGaming } from "./pages/Gaming/pages/ContentGaming";
import LenguajeSeleccionado from "./pages/Gaming/pages/lenguajeseleccionado";
import Programa from "./pages/Gaming/pages/programa";

import ContentComunidad from "./pages/Comunidad/pages/ContentComunidad";
import Comunidadprevia from './pages/Comunidad/pages/comunidadprevia';

import Clase from "./pages/cursos/pages/Clase";
import AddLP from "./pages/cursos/pages/AddLP";
import Ruta from "./pages/cursos/pages/Ruta";
import AddCurso from "./pages/cursos/pages/AddCurso";
import AddSeccion from "./pages/cursos/pages/AddSeccion";
import Curso from "./pages/cursos/pages/Curso";

import Login from "./pages/log/Login";
import Registrar from "./pages/log/Registrar";
import Home2 from "./pages/home/Home2";
import Terminosycondiciones from "./pages/log/terminosycondiciones"
import Pasarela from "./components/pasarela de pagos/pasarela"
import { AuthProvider, useAuth } from './context/auth/AuthContext';
import { diagnoseAuthState } from './context/auth/utils/authUtils';

import { ContentConfirmacionPago } from './pages/Aprobacion de suscripcion/pages/Admin';

// Importar función para verificar si es administrador
import { isAdmin } from './context/auth/utils/authUtils'; // Ajusta la ruta según tu estructura

// Componente de Loading reutilizable
const LoadingSpinner = ({ message = "Cargando..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

// Componente de error de autenticación
const AuthError = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-md">
      <div className="text-red-500 text-6xl">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800">Error de Autenticación</h2>
      <p className="text-gray-600 text-center">{message}</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Reintentar
      </button>
    </div>
  </div>
);

// Componente de acceso denegado para administradores
const AccessDenied = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-md">
      <div className="text-red-500 text-6xl">🚫</div>
      <h2 className="text-xl font-semibold text-gray-800">Acceso Denegado</h2>
      <p className="text-gray-600 text-center">
        No tienes permisos de administrador para acceder a esta página.
      </p>
      <button 
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Volver Atrás
      </button>
    </div>
  </div>
);

// Componente de protección para rutas de administrador
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { authToken, isLoading } = useAuth();

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return <LoadingSpinner message="Verificando permisos..." />;
  }

  // Si no está autenticado, redirigir al login
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si es administrador
  if (!isAdmin()) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

// Layout público (sin autenticación)
function PublicLayout() {
  const { authToken, isLoading, error } = useAuth();
  
  useEffect(() => {
    // Diagnosticar estado cuando hay problemas
    if (error && error.includes('critical')) {
      diagnoseAuthState();
    }
  }, [authToken, isLoading, error]);
  
  // Si está cargando, mostrar spinner
  if (isLoading) {
    return <LoadingSpinner message="Inicializando aplicación..." />;
  }
  
  // Mostrar error si hay problemas críticos
  if (error && error.includes('critical')) {
    return <AuthError message={error} onRetry={() => window.location.reload()} />;
  }
  
  // Si ya está autenticado y trata de acceder a rutas públicas, redirigir
  const protectedRoutes = ['/login', '/registrar'];
  if (authToken && protectedRoutes.includes(window.location.pathname)) {
    return <Navigate to="/Inicio" replace />;
  }
  
  return <Outlet />;
}

// Layout protegido (requiere autenticación)
function ProtectedLayout() {
  const { isDarkMode } = useTheme();
  const { authToken, isLoading, error, refreshAuth } = useAuth();

  useEffect(() => {
    // Diagnosticar problemas de autenticación
    if (!authToken && !isLoading) {
      diagnoseAuthState();
    }
  }, [authToken, isLoading, error]);

  // Mientras carga, mostrar spinner
  if (isLoading) {
    return <LoadingSpinner message="Verificando acceso..." />;
  }

  // Si hay error crítico, mostrar pantalla de error
  if (error && error.includes('critical')) {
    return <AuthError message={error} onRetry={refreshAuth} />;
  }

  // Si no está autenticado, redirigir al login CON DELAY para evitar loops
  if (!authToken) {
    setTimeout(() => {
      if (!localStorage.getItem('authToken')) {
        window.location.href = '/login';
      }
    }, 100);
    
    return <LoadingSpinner message="Redirigiendo al login..." />;
  }

  // Renderizar layout protegido
  return (
    <div className={`relative min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`fixed top-0 left-0 h-screen w-56 ${isDarkMode ? 'bg-custom-bg' : 'bg-white border-r border-gray-200'} z-30`}>
        <Sidebar />
      </div>
      <div className={`fixed top-0 left-56 right-0 h-14 ${isDarkMode ? 'bg-custom-bg' : 'bg-white border-b border-gray-200'} z-40`}>
        <Topbar />
      </div>
      <main className="pt-14 ml-56 overflow-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

// Componente que maneja la inicialización de la app
function AppInitializer() {
  const { isLoading, error } = useAuth();

  useEffect(() => {
    // Diagnosticar al inicio si hay debug activo
    if (!isLoading) {
      setTimeout(() => {
        diagnoseAuthState();
      }, 1000);
    }
  }, [isLoading, error]);

  if (isLoading) {
    return <LoadingSpinner message="Iniciando aplicación..." />;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/terminos_y_condiciones" element={<Terminosycondiciones />} />
      </Route>

      {/* Rutas protegidas */}
      <Route element={<ProtectedLayout />}>
        <Route path="/Inicio" element={<ContentInicio />} />
        <Route path="/mejora_tu_plan" element={<Pasarela />} />
        <Route path="/Inicio/comunidadesdisponibles" element={<ComunidadesDisponibles />} />
        <Route path="/Inicio/novedades" element={<DetalleNoticia />} />
        
        {/* Rutas de cursos para usuarios regulares */}
        <Route path="/cursos" element={<Curso />} />
        <Route path="/cursos/Ruta/:id_curso" element={<Ruta />} />
        <Route path="/cursos/:id_curso/clase/:id_recurso" element={<Clase />} />
        <Route path="/cursos/Clase" element={<Clase />} />
        <Route path="/cursos/ruta" element={<Ruta />} />
        <Route path="/cursos/view" element={<Clase />} />
        
        <Route path="/gaming" element={<ContentGaming />} />
        <Route path="/gaming/lenguajeseleccionado" element={<LenguajeSeleccionado />} />
        <Route path="/gaming/lenguajeseleccionado/programa/:exerciseId" element={<Programa />} />
        
        <Route path="/comunidad/:id" element={<ContentComunidad />} />
        <Route path="/Inicio/vistaprevia" element={<Comunidadprevia />} />

        {/* Rutas protegidas solo para administradores */}
        <Route 
          path="/confirmacion_de_pago" 
          element={
            <AdminRoute>
              <ContentConfirmacionPago />
            </AdminRoute>
          } 
        />
        <Route 
          path="/AddLP" 
          element={
            <AdminRoute>
              <AddLP />
            </AdminRoute>
          } 
        />
        {/* Rutas de administración de cursos - SOLO ADMINISTRADORES */}
        <Route 
          path="/AddLP/AddCurso" 
          element={
            <AdminRoute>
              <AddCurso />
            </AdminRoute>
          } 
        />
        <Route 
          path="/AddLP/AddCurso/:id_lenguaje" 
          element={
            <AdminRoute>
              <AddCurso />
            </AdminRoute>
          } 
        />
        <Route 
          path="/AddLP/AddSeccion" 
          element={
            <AdminRoute>
              <AddSeccion />
            </AdminRoute>
          } 
        />
        <Route 
          path="/AddLP/AddSeccion/:id_curso" 
          element={
            <AdminRoute>
              <AddSeccion />
            </AdminRoute>
          } 
        />
      </Route>

      {/* Ruta fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Componente principal de la App
function App() {
  useEffect(() => {
    // Agregar listener para cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        // Aquí puedes manejar el cambio sin usar debug
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <UserCommunitiesProvider>
            <ComunidadSeleccionadaProvider>
              <CommunityFilterProvider>
                <AppInitializer />
              </CommunityFilterProvider>
            </ComunidadSeleccionadaProvider>
          </UserCommunitiesProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;