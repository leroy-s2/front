// 1. Arreglo para Comunidadporusuario.ts
import { getToken, decodeToken } from '../context/auth/utils/authUtils';
import type { UserCommunity } from '../models/UserCommunity';

const API_URL = 'http://localhost:8222/api/usuario_comunidad/comunidades_de_usuario/';

export async function getCommunities(): Promise<UserCommunity[]> {
  try {
    const token = getToken();

    if (!token) {
      return []; // El token no se encontró, simplemente retornamos vacío
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken || !decodedToken.user_id) {
      return []; // El token es inválido o no tiene user_id
    }

    const userId = decodedToken.user_id;

    const response = await fetch(`${API_URL}${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return []; // Token expirado o inválido
      }
      if (response.status === 404) {
        return []; // Usuario no tiene comunidades
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Verificar si la respuesta tiene contenido
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return []; // Respuesta no es JSON válido
    }

    const text = await response.text();
    if (!text.trim()) {
      return []; // Respuesta vacía del servidor
    }

    const data = JSON.parse(text);
    
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    return []; // Si ocurre un error, retornamos vacío
  }
}
