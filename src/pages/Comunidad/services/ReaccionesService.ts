import { getToken } from '../../../context/auth/utils/authUtils';
import type{ ReaccionPublicacion, ReaccionResponse, ApiResponse } from '../types/ReactionTypes'; 
import type { ReactionType,Reaccion } from '../types/ReactionTypes';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8222/api/reaccion_publicacion';

// Utilidad para manejar respuestas HTTP
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error: data.message || `Error ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error al procesar la respuesta del servidor',
    };
  }
};

// Utilidad para crear headers con autenticación
const createAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Servicios de API
export class ReaccionesApiService {
  static async listarReaccionesPorPublicacion(publicacionId: number): Promise<ApiResponse<ReaccionResponse[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/publicacion/lista_total/${publicacionId}`, {
        method: 'GET',
        headers: createAuthHeaders(),
      });

      return await handleResponse<ReaccionResponse[]>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Error de conexión al servidor',
      };
    }
  }

  static async crearReaccion(reaccion: ReaccionPublicacion): Promise<ApiResponse<ReaccionResponse>> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify(reaccion),
      });

      return await handleResponse<ReaccionResponse>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Error de conexión al servidor',
      };
    }
  }

  static async eliminarReaccion(reaccionId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/${reaccionId}`, {
        method: 'DELETE',
        headers: createAuthHeaders(),
      });

      return await handleResponse<void>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Error de conexión al servidor',
      };
    }
  }

  

  // Alterna entre crear y eliminar una reacción
  static async alternarReaccion(publicacionId: number, reaccionId?: number, tipo: ReactionType = "LIKE"): Promise<ApiResponse<ReaccionResponse | void>> {
    try {
      // Si la reacción ya existe (reaccionId está presente), la eliminamos
      if (reaccionId) {
        return await this.eliminarReaccion(reaccionId);
      } else {
        // Si no existe, creamos una nueva reacción
        const nuevaReaccion: ReaccionPublicacion = {
          tipo_reaccion: tipo, // usamos el tipo pasado como argumento
          publicacion: {
            id: publicacionId,
          },
        };
        return await this.crearReaccion(nuevaReaccion);
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error al alternar la reacción',
      };
    }
  }
}

// lista de reacciones por comunidad
// Esta función obtiene todas las reacciones de publicaciones en una comunidad específica a la que reacciono el usuario autenticado.
// Se asume que el usuario ya está autenticado y tiene un token válido.
export const getReaccionesPorComunidad = async (idComunidad: number): Promise<Reaccion[]> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get(
      `http://localhost:8222/api/reaccion_publicacion/listareaciones/publicaciones/comunidad/${idComunidad}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching reactions:', error);
    throw error;
  }
};

