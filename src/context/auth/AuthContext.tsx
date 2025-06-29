// src/context/auth/AuthContext.tsx - Versión mejorada para sesión persistente
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getToken,
  isTokenValid,
  login as loginUtil,
  logout as logoutUtil,
  getUserData,
  extractAndSaveUserData
} from './utils/authUtils';
import {
  refreshToken,
  getTimeUntilExpiration
} from './authActions';
import type { UserData } from './utils/authUtils';

type AuthContextType = {
  authToken: string | null;
  user: UserData | null;
  login: (token: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUserData: () => void;
  timeUntilExpiration: number;
  error: string | null; // Nueva propiedad para manejar errores
  refreshAuth: () => void; // Nueva propiedad para manejar la renovación manual del token
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState(0);
  const [error, setError] = useState<string | null>(null); // Estado para almacenar errores
  const navigate = useNavigate();

  // Referencias para los intervalos
  const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const expirationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityListenerRef = useRef<(() => void) | null>(null);

  // Función para verificar si el refresh token es válido
  const isRefreshTokenValid = (): boolean => {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
    
    if (!refreshToken || !refreshTokenExpiration) {
      return false;
    }
    
    return new Date().getTime() < parseInt(refreshTokenExpiration);
  };

  // Función para cargar datos del usuario
  const loadUserData = () => {
    const userData = getUserData();
    setUser(userData);
    return userData;
  };

  // Función para refrescar datos del usuario
  const refreshUserData = () => {
    const userData = extractAndSaveUserData();
    setUser(userData);
  };

  // Función para actualizar el contador de expiración
  const updateExpirationTimer = () => {
    const timeRemaining = getTimeUntilExpiration();
    setTimeUntilExpiration(timeRemaining);

    // Solo cerrar sesión si no hay refresh token válido
    if (timeRemaining <= 0 && isAuthenticated && !isRefreshTokenValid()) {
      console.log('Token y refresh token expirados, cerrando sesión...');
      logout();
    }
  };

  // Función para renovar el token automáticamente
  const handleTokenRefresh = async () => {
    try {
      console.log('Verificando necesidad de renovación de token...');
      const refreshTokenValue = localStorage.getItem('refreshToken');

      if (!refreshTokenValue) {
        console.log('No hay refresh token disponible');
        logout();
        return;
      }

      if (!isRefreshTokenValid()) {
        console.log('Refresh token expirado');
        logout();
        return;
      }

      // Verificar si el token actual está próximo a expirar (5 minutos antes)
      const timeUntilExp = getTimeUntilExpiration();
      const shouldRefresh = timeUntilExp <= 5 * 60 * 1000; // 5 minutos en milisegundos

      if (!shouldRefresh && isTokenValid()) {
        console.log('Token aún válido, no es necesario renovar');
        return;
      }

      console.log('Renovando token...');
      const refreshResult = await refreshToken(refreshTokenValue);

      if (refreshResult.success && refreshResult.userData) {
        console.log('Token renovado exitosamente');

        const newToken = getToken();
        setAuthToken(newToken);
        setUser(refreshResult.userData);

        // Actualizar el contador de expiración
        updateExpirationTimer();

        // Mostrar notificación opcional de renovación exitosa
        console.log('Sesión renovada automáticamente');

      } else {
        console.error('Error al renovar token:', refreshResult.error);
        logout();
      }
    } catch (error) {
      console.error('Error durante la renovación del token:', error);
      // No cerrar sesión inmediatamente, dar otra oportunidad
      setError('Error al renovar el token. Intente nuevamente.');
      setTimeout(() => {
        if (isAuthenticated && !isTokenValid() && !isRefreshTokenValid()) {
          logout();
        }
      }, 30000); // Reintentar en 30 segundos
    }
  };

  // Función para manejar cambios de visibilidad de la página
  const handleVisibilityChange = () => {
    if (!document.hidden && isAuthenticated) {
      console.log('Página visible de nuevo, verificando token...');
      // Verificar inmediatamente el estado del token cuando la página vuelve a ser visible
      setTimeout(handleTokenRefresh, 1000);
    }
  };

  // Función para configurar la renovación automática del token
  const setupTokenRefresh = (rememberMe: boolean) => {
    // Limpiar intervalos previos
    clearAllIntervals();

    if (rememberMe) {
      console.log('Configurando renovación automática del token cada 15 minutos');

      // Renovación cada 15 minutos (más frecuente para mayor seguridad)
      tokenRefreshIntervalRef.current = setInterval(() => {
        handleTokenRefresh();
      }, 15 * 60 * 1000);

      // Actualizar contador de expiración cada 30 segundos
      expirationTimerRef.current = setInterval(() => {
        updateExpirationTimer();
      }, 30 * 1000);

      // Configurar listener para cambios de visibilidad
      visibilityListenerRef.current = handleVisibilityChange;
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Actualización inicial
      updateExpirationTimer();
    } else {
      // Si no hay remember me, verificar más frecuentemente
      tokenRefreshIntervalRef.current = setInterval(() => {
        if (!isTokenValid()) {
          if (isRefreshTokenValid()) {
            handleTokenRefresh();
          } else {
            console.log('Token inválido y no hay refresh token válido, cerrando sesión...');
            logout();
          }
        } else {
          updateExpirationTimer();
        }
      }, 2 * 60 * 1000); // Cada 2 minutos

      updateExpirationTimer();
    }
  };

  // Función para limpiar todos los intervalos y listeners
  const clearAllIntervals = () => {
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current);
      tokenRefreshIntervalRef.current = null;
    }
    if (expirationTimerRef.current) {
      clearInterval(expirationTimerRef.current);
      expirationTimerRef.current = null;
    }
    if (visibilityListenerRef.current) {
      document.removeEventListener('visibilitychange', visibilityListenerRef.current);
      visibilityListenerRef.current = null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        const rememberMe = localStorage.getItem('rememberMe') === 'true';

        if (token) {
          if (isTokenValid()) {
            // Token válido
            setAuthToken(token);
            setIsAuthenticated(true);

            const userData = loadUserData();
            if (!userData) {
              refreshUserData();
            }

            setupTokenRefresh(rememberMe);
          } else if (isRefreshTokenValid()) {
            // Token expirado pero refresh token válido
            console.log('Token expirado, intentando renovar con refresh token...');
            await handleTokenRefresh();
            
            if (isTokenValid()) {
              const newToken = getToken();
              setAuthToken(newToken);
              setIsAuthenticated(true);
              
              const userData = loadUserData();
              if (!userData) {
                refreshUserData();
              }
              
              setupTokenRefresh(rememberMe);
            } else {
              logoutUtil();
              setAuthToken(null);
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            // Ambos tokens expirados
            logoutUtil();
            setAuthToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No hay token
          logoutUtil();
          setAuthToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logoutUtil();
        setAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      clearAllIntervals();
    };
  }, []);

  const login = async (token: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      const userData = loginUtil(token);

      if (userData) {
        setAuthToken(token);
        setUser(userData);
        setIsAuthenticated(true);

        // Si remember me está activo, establecer expiración del refresh token
        if (rememberMe) {
          const refreshTokenExpiration = new Date().getTime() + (10 * 24 * 60 * 60 * 1000); // 10 días
          localStorage.setItem('refreshTokenExpiration', refreshTokenExpiration.toString());
        }

        // Configurar renovación según las preferencias
        setupTokenRefresh(rememberMe);

        return true;
      } else {
        console.error('Failed to extract user data from token');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Iniciando proceso de logout...');

    clearAllIntervals();
    logoutUtil();

    // Limpiar todas las preferencias y tokens
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiration');
    localStorage.removeItem('tokenExpiration');

    // Limpiar estado de autenticación
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setTimeUntilExpiration(0);

    // Disparar evento customizado para notificar a otros contextos
    window.dispatchEvent(new CustomEvent('userLogout', {
      detail: { timestamp: Date.now() }
    }));

    console.log('Logout completado, redirigiendo...');
    navigate('/');
  };

  const refreshAuth = () => {
    console.log('Intentando renovar la sesión manualmente...');
    handleTokenRefresh();
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        login,
        logout,
        isLoading,
        isAuthenticated,
        refreshUserData,
        timeUntilExpiration,
        error,           // Exponemos el error
        refreshAuth      // Exponemos la función de renovación manual
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
