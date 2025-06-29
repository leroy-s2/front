// src/services/communityService.ts
import { getToken } from '../../../context/auth/utils/authUtils';
import { getUserId } from '../../../context/auth/utils/authUtils'; // Ajusta la ruta según tu estructura de proyecto

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const API_BASE_URL = 'http://localhost:8222/api';

class CommunityService {
  // Método para unirse a la comunidad
  async joinCommunity(communityId: number): Promise<ApiResponse> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/usuario_comunidad/nuevo_usuario/comunidad/${communityId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Te has unido a la comunidad exitosamente',
        data: data,
      };
    } catch (error) {
      console.error('Error al unirse a la comunidad:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al unirse a la comunidad',
      };
    }
  }

  // Método para salir de la comunidad
  // Reemplaza el método leaveCommunity en tu archivo communityService.ts con este:

async leaveCommunity(communityId: number): Promise<ApiResponse> {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await fetch(`${API_BASE_URL}/usuario_comunidad/salir/comunidad/${communityId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Manejar errores del servidor
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no se puede parsear el error como JSON, usar el mensaje por defecto
      }
      
      throw new Error(errorMessage);
    }

    // Verificar si hay contenido en la respuesta
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    const hasJsonContent = contentType && contentType.includes('application/json');
    const hasContent = contentLength !== '0' && contentLength !== null;
    
    let data = null;
    let message = 'Has salido de la comunidad exitosamente';
    
    if (hasJsonContent && hasContent) {
      // Solo parsear JSON si hay contenido JSON
      try {
        data = await response.json();
        message = data.message || message;
      } catch (jsonError) {
        console.warn('No se pudo parsear la respuesta como JSON:', jsonError);
        // Continuar con respuesta exitosa aunque no se pueda parsear el JSON
      }
    }

    return {
      success: true,
      message: message,
      data: data,
    };
  } catch (error) {
    console.error('Error al salir de la comunidad:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al salir de la comunidad',
    };
  }
}



  // Método para verificar si el usuario está unido a la comunidad
  async checkIfUserIsInCommunity(communityId: number): Promise<ApiResponse> {
    try {
      const userId = getUserId(); // Obtener ID del usuario desde getUserId()
      if (!userId) {
        throw new Error('ID de usuario no encontrado');
      }

      // Llamar a la API para verificar si el usuario está en la comunidad
      const response = await fetch(`${API_BASE_URL}/usuario_comunidad/vinculado/comunidad/${communityId}/usuario/${userId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // La API devuelve 'true' o 'false', lo convertimos en respuesta adecuada
      return {
        success: true,
        message: data.toString() === 'true' ? 'El usuario está unido a la comunidad' : 'El usuario no está unido a la comunidad',
        data: data,
      };
    } catch (error) {
      console.error('Error al verificar si el usuario está en la comunidad:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al verificar la comunidad',
      };
    }
  }

  // Otros métodos para unirse o salir de una comunidad seleccionada
  async joinSelectedCommunity(comunidadSeleccionada: any): Promise<ApiResponse> {
    if (!comunidadSeleccionada) {
      return {
        success: false,
        message: 'No hay comunidad seleccionada',
      };
    }
    return this.joinCommunity(comunidadSeleccionada.id);
  }

  async leaveSelectedCommunity(comunidadSeleccionada: any): Promise<ApiResponse> {
    if (!comunidadSeleccionada) {
      return {
        success: false,
        message: 'No hay comunidad seleccionada',
      };
    }
    return this.leaveCommunity(comunidadSeleccionada.id);
  }
}

export const communityService = new CommunityService();
export default CommunityService;
