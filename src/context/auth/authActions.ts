// src/services/authService.ts - Versión mejorada
import { 
  login as loginUtil, 
  logout as logoutUtil,
  decodeToken,
  getUserData,
} from './utils/authUtils';
import type { UserData } from './utils/authUtils';

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type: string;
}

export interface LoginResult {
  success: boolean;
  userData?: UserData;
  error?: string;
}

// Función para realizar el login
export const loginUser = async (username: string, password: string): Promise<LoginResult> => {
  const loginData = new URLSearchParams({
    grant_type: 'password',
    client_id: 'users-service-client',
    client_secret: 'DRfJ84iZax3f77WL9op5TWp5kew0aN0V',
    username,
    password
  });

  try {
    // Realizamos la petición al backend para obtener el token
    const response = await fetch('http://localhost:8080/realms/sharecoding/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: loginData
    });

    // Verificar el cuerpo de la respuesta si hay un error
    const responseBody = await response.json();
    if (!response.ok) {
      console.error('Error en la respuesta de Keycloak:', responseBody);
      return {
        success: false,
        error: `Error de autenticación: ${responseBody.error_description || 'Error desconocido'}`
      };
    }

    const data: LoginResponse = responseBody;

    if (data.access_token) {
      // Usar la función mejorada de login que maneja todo automáticamente
      const userData = loginUtil(data.access_token);
      
      if (userData) {
        // Guardar refresh token si está disponible
        if (data.refresh_token) {
          localStorage.setItem('refreshToken', data.refresh_token);
        }
        
        // Guardar información de expiración para renovación inteligente
        if (data.expires_in) {
          const expirationTime = Date.now() + (data.expires_in * 1000);
          localStorage.setItem('tokenExpiration', expirationTime.toString());
        }
        
        return {
          success: true,
          userData
        };
      } else {
        return {
          success: false,
          error: 'Error al extraer datos del usuario del token'
        };
      }
    } else {
      return {
        success: false,
        error: 'No se recibió token de acceso'
      };
    }
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      error: error instanceof Error ? `Error de autenticación: ${error.message}` : 'Error desconocido durante el login'
    };
  }
};

// Función para realizar el logout
export const logoutUser = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Opcional: Invalidar el token en el servidor
    if (refreshToken) {
      try {
        await fetch('http://localhost:8080/realms/sharecoding/protocol/openid-connect/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: 'users-service-client',
            client_secret: 'DRfJ84iZax3f77WL9op5TWp5kew0aN0V',
            refresh_token: refreshToken
          })
        });
      } catch (logoutError) {
        console.warn('Error al invalidar token en servidor:', logoutError);
        // Continuar con logout local aunque falle el logout del servidor
      }
    }

    // Usar la función mejorada de logout
    logoutUtil();
    
    // Limpiar todos los tokens y preferencias
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('rememberMe');
    
  } catch (error) {
    console.error('Error durante logout:', error);
    // Asegurar limpieza local incluso si hay errores
    logoutUtil();
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('rememberMe');
  }
};

// Función para refrescar el token
export const refreshToken = async (refreshTokenValue?: string): Promise<LoginResult> => {
  const refreshTokenToUse = refreshTokenValue || localStorage.getItem('refreshToken');
  
  if (!refreshTokenToUse) {
    return {
      success: false,
      error: 'No hay refresh token disponible'
    };
  }

  const refreshData = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: 'users-service-client',
    client_secret: 'DRfJ84iZax3f77WL9op5TWp5kew0aN0V',
    refresh_token: refreshTokenToUse
  });

  try {
    // Realizamos la petición al backend para obtener un nuevo token
    const response = await fetch('http://localhost:8080/realms/sharecoding/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: refreshData
    });

    if (!response.ok) {
      const errorBody = await response.json();
      return {
        success: false,
        error: `Error al refrescar token: ${errorBody.error_description || 'Error desconocido'}`
      };
    }

    const data: LoginResponse = await response.json();

    if (data.access_token) {
      // Usar la función mejorada de login para actualizar el token
      const userData = loginUtil(data.access_token);
      
      if (userData) {
        // Actualizar refresh token si viene uno nuevo
        if (data.refresh_token) {
          localStorage.setItem('refreshToken', data.refresh_token);
        }
        
        // Actualizar información de expiración
        if (data.expires_in) {
          const expirationTime = Date.now() + (data.expires_in * 1000);
          localStorage.setItem('tokenExpiration', expirationTime.toString());
        }
        
        return {
          success: true,
          userData
        };
      } else {
        return {
          success: false,
          error: 'Error al extraer datos del usuario del token renovado'
        };
      }
    } else {
      return {
        success: false,
        error: 'No se pudo refrescar el token'
      };
    }
  } catch (error) {
    console.error('Error al refrescar token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al refrescar token'
    };
  }
};

// Función mejorada para renovación automática inteligente del token
export const autoRefreshToken = async (): Promise<boolean> => {
  try {
    // Verificar si el token está por expirar
    const tokenInfo = getCurrentTokenInfo();
    if (!tokenInfo) return false;

    const { expiresIn } = tokenInfo;
    
    // Renovar si el token expira en menos de 5 minutos (300 segundos)
    // Esto es más conservador que esperar hasta los últimos 60 segundos
    const thresholdTime = 300;

    if (expiresIn <= thresholdTime) {
      console.log(`Token expira en ${expiresIn} segundos, renovando...`);
      const refreshResult = await refreshToken();
      return refreshResult.success;
    }

    return true;
  } catch (error) {
    console.error('Error en renovación automática:', error);
    return false;
  }
};

// Función para verificar si el token necesita renovación (para Remember Me)
export const shouldRefreshToken = (): boolean => {
  try {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (!tokenExpiration) return false;
    
    const expirationTime = parseInt(tokenExpiration);
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    
    // Renovar si faltan menos de 5 minutos (300000 ms) para la expiración
    return timeUntilExpiration <= 300000;
  } catch (error) {
    console.error('Error verificando si debe renovar token:', error);
    return false;
  }
};

// Función para obtener tiempo restante hasta la expiración
export const getTimeUntilExpiration = (): number => {
  try {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (!tokenExpiration) return 0;
    
    const expirationTime = parseInt(tokenExpiration);
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    
    return Math.max(0, Math.floor(timeUntilExpiration / 1000)); // Retornar en segundos
  } catch (error) {
    console.error('Error obteniendo tiempo hasta expiración:', error);
    return 0;
  }
};

// Función para validar credenciales (útil para verificar antes de operaciones sensibles)
export const validateCredentials = async (username: string, password: string): Promise<boolean> => {
  try {
    const result = await loginUser(username, password);
    return result.success;
  } catch (error) {
    console.error('Error validando credenciales:', error);
    return false;
  }
};

// Función para obtener información del token actual
export const getCurrentTokenInfo = () => {
  const userData = getUserData();
  const token = localStorage.getItem('authToken');
  
  if (!token || !userData) {
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expiresIn = decoded.exp - currentTime;
  const expiresAt = new Date(decoded.exp * 1000);

  return {
    userData,
    expiresIn,
    expiresAt,
    issuedAt: new Date(decoded.iat * 1000),
    issuer: decoded.iss,
    subject: decoded.sub
  };
};

// Función para verificar si el usuario tiene conexión con el servidor
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:8080/realms/sharecoding/.well-known/openid_configuration', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error verificando conexión al servidor:', error);
    return false;
  }
};