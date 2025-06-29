// src/utils/authUtils.ts

// Interfaces para tipado fuerte
export interface UserData {
  user_id: number;
  nombre: string;
  apellido: string;
  email: string;
  preferred_username: string;
  fechaNacimiento: string;
  pais: string;
  email_verified: boolean;
  roles: string[];
  sub: string;
  access_token?: string;
}

export interface TokenPayload {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  sid: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [key: string]: {
      roles: string[];
    };
  };
  scope: string;
  email_verified: boolean;
  user_id: number;
  fechaNacimiento: string;
  apellido: string;
  preferred_username: string;
  nombre: string;
  email: string;
  pais: string;
}

// ===== FUNCIONES DE TOKEN =====

// Obtener el token JWT del localStorage
export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

// Guardar token en localStorage
export const setToken = (token: string): void => {
  try {
    localStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving token to localStorage:', error);
  }
};

// Eliminar el token JWT del localStorage
export const removeToken = (): void => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('rememberMe');
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};

// Decodificar JWT para obtener el payload
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const parsedPayload = JSON.parse(decoded) as TokenPayload;
    return parsedPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Verificar si el token es válido (considerando Remember Me)
export const isTokenValid = (): boolean => {
  try {
    const token = getToken();
    
    if (!token) {
      return false;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const jwtValid = decoded.exp > currentTime;
    
    // Si el JWT aún es válido, retornar true
    if (jwtValid) {
      return true;
    }
    
    // Si JWT expiró, verificar Remember Me
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const customExpiration = localStorage.getItem('tokenExpiration');
    
    if (rememberMe && customExpiration) {
      const customExpTime = parseInt(customExpiration);
      const isCustomValid = Date.now() < customExpTime;
      
      if (isCustomValid) {
        return true;
      } else {
        // Limpiar datos expirados
        removeToken();
        return false;
      }
    }
    
    return false;
    
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Verificar si el token está por expirar
export const isTokenExpiringSoon = (minutesThreshold: number = 5): boolean => {
  try {
    const token = getToken();
    if (!token) return true;

    const decoded = decodeToken(token);
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = decoded.exp - currentTime;
    const thresholdSeconds = minutesThreshold * 60;

    return timeUntilExpiration <= thresholdSeconds;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Extender sesión con Remember Me
export const extendSessionWithRememberMe = (days: number = 30): void => {
  try {
    const expirationTime = new Date().getTime() + (1000 * 60 * 60 * 24 * days);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('rememberMe', 'true');
  } catch (error) {
    console.error('Error extending session:', error);
  }
};

// ===== FUNCIONES DE DATOS DE USUARIO =====

// Extraer datos del usuario del token y guardarlos
export const extractAndSaveUserData = (): UserData | null => {
  try {
    const token = getToken();
    if (!token) {
      return null;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return null;
    }

    const userData: UserData = {
      user_id: decoded.user_id,
      nombre: decoded.nombre,
      apellido: decoded.apellido,
      email: decoded.email,
      preferred_username: decoded.preferred_username,
      fechaNacimiento: decoded.fechaNacimiento,
      pais: decoded.pais,
      email_verified: decoded.email_verified,
      roles: decoded.realm_access?.roles || [],
      sub: decoded.sub
    };

    // Guardar datos del usuario en localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Error extracting user data:', error);
    return null;
  }
};

// Obtener datos del usuario desde localStorage
export const getUserData = (): UserData | null => {
  try {
    const userDataStr = localStorage.getItem('userData');
    if (!userDataStr) {
      return extractAndSaveUserData();
    }
    
    const userData = JSON.parse(userDataStr) as UserData;
    return userData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Obtener nombre completo del usuario
export const getFullName = (): string => {
  const userData = getUserData();
  if (!userData) return '';
  return `${userData.nombre} ${userData.apellido}`.trim();
};

// Obtener solo el nombre
export const getFirstName = (): string => {
  const userData = getUserData();
  return userData?.nombre || '';
};

// Obtener solo el apellido
export const getLastName = (): string => {
  const userData = getUserData();
  return userData?.apellido || '';
};

// Obtener email del usuario
export const getUserEmail = (): string => {
  const userData = getUserData();
  return userData?.email || '';
};

// Obtener username
export const getUserUsername = (): string => {
  const userData = getUserData();
  return userData?.preferred_username || '';
};

// Obtener país del usuario
export const getUserCountry = (): string => {
  const userData = getUserData();
  return userData?.pais || '';
};

// Obtener fecha de nacimiento
export const getUserBirthDate = (): string => {
  const userData = getUserData();
  return userData?.fechaNacimiento || '';
};

// Calcular edad del usuario
export const getUserAge = (): number | null => {
  const birthDateStr = getUserBirthDate();
  if (!birthDateStr) return null;

  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Obtener ID del usuario
export const getUserId = (): number | null => {
  const userData = getUserData();
  return userData?.user_id || null;
};

// ===== FUNCIONES DE ROLES Y PERMISOS =====

// Obtener roles del usuario
export const getUserRoles = (): string[] => {
  const userData = getUserData();
  return userData?.roles || [];
};

// Verificar si el usuario tiene un rol específico
export const hasRole = (role: string): boolean => {
  const roles = getUserRoles();
  return roles.includes(role);
};  

// Verificar si el usuario es administrador
export const isAdmin = (): boolean => {
  return hasRole('ADMIN');
};

// Verificar si el usuario es usuario regular
export const isUser = (): boolean => {
  return hasRole('USUARIO');
};

// ===== FUNCIONES DE AUTENTICACIÓN =====

// Verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  const tokenValid = isTokenValid();
  const hasUserData = getUserData() !== null;
  
  return tokenValid && hasUserData;
};

// Función de logout completo
export const logout = (): void => {
  removeToken();
  // Opcional: redirigir al login
  // window.location.href = '/login';
};

// Función de login (para usar después de recibir el token)
export const login = (token: string, rememberMe: boolean = false): UserData | null => {
  setToken(token);
  const userData = extractAndSaveUserData();
  
  // Si Remember Me está activo, extender la sesión
  if (rememberMe && userData) {
    extendSessionWithRememberMe();
  }
  
  return userData;
};

// ===== FUNCIONES DE UTILIDAD =====

// Obtener información completa del usuario
export const getUserInfo = () => {
  const userData = getUserData();
  if (!userData) return null;

  return {
    ...userData,
    fullName: getFullName(),
    age: getUserAge(),
    isEmailVerified: userData.email_verified,
    isAdmin: isAdmin(),
    isUser: isUser()
  };
};
// Obtener el sub (ID de Keycloak) del usuario
export const getUserSub = (): string => {
  const userData = getUserData();
  return userData?.sub || '';
};

// Refrescar datos del usuario desde el token
export const refreshUserData = (): UserData | null => {
  localStorage.removeItem('userData');
  return extractAndSaveUserData();
};

// Verificar si el email está verificado
export const isEmailVerified = (): boolean => {
  const userData = getUserData();
  return userData?.email_verified || false;
};

// ===== FUNCIONES DE DIAGNÓSTICO (Solo para desarrollo) =====

// Función para diagnosticar el estado de autenticación (usar solo cuando sea necesario)
export const diagnoseAuthState = () => {
  console.log('🔍 === DIAGNÓSTICO DE AUTENTICACIÓN ===');
  
  const token = getToken();
  const userData = getUserData();
  const rememberMe = localStorage.getItem('rememberMe');
  const tokenExpiration = localStorage.getItem('tokenExpiration');
  
  console.log('📊 Estado del localStorage:', {
    hasToken: !!token,
    tokenLength: token?.length,
    hasUserData: !!userData,
    rememberMe,
    tokenExpiration: tokenExpiration ? new Date(parseInt(tokenExpiration)) : null
  });
  
  if (token) {
    const decoded = decodeToken(token);
    if (decoded) {
      const currentTime = Math.floor(Date.now() / 1000);
      console.log('🔓 Información del token:', {
        usuario: decoded.nombre + ' ' + decoded.apellido,
        email: decoded.email,
        roles: decoded.realm_access?.roles,
        emitido: new Date(decoded.iat * 1000),
        expira: new Date(decoded.exp * 1000),
        tiempoRestante: Math.floor((decoded.exp - currentTime) / 60) + ' minutos',
        esValido: decoded.exp > currentTime
      });
    }
  }
  
  console.log('✅ Estado final:', {
    isTokenValid: isTokenValid(),
    isAuthenticated: isAuthenticated(),
    userInfo: getUserInfo()
  });
  
  console.log('🔍 === FIN DIAGNÓSTICO ===');
};