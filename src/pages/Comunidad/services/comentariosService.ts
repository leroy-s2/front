import { getToken } from '../../../context/auth/utils/authUtils'; // Importa la función para obtener el token
import type { Comentariopost } from '../models/Comentarios'; // Importa el modelo de Comentario

const API_URL = 'http://localhost:8222/api/comentarios'; // Asegúrate de que esta URL sea correcta

// Función para manejar las respuestas de la API
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la solicitud');
  }
  return await response.json();
};

// Funciones del servicio de comentarios
export const comentariosService = {
  // Función para obtener los comentarios de una publicación
  obtenerComentariosPorPublicacion: async (idPublicacion: number) => {
    try {
      const response = await fetch(`${API_URL}/publicacion/${idPublicacion}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los comentarios');
      }

      const comentarios = await response.json();
      return comentarios;
    } catch (error) {
      console.error("Error en comentariosService:", error);
      throw error;
    }
  },

  // Función para crear un nuevo comentario (requiere autenticación)
  crearComentario: async (comentarioData: Comentariopost) => {
    const token = getToken();

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Enviar el token en los headers
        },
        body: JSON.stringify(comentarioData),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Error al crear comentario:", error);
      throw error;
    }
  },

  // Función para eliminar un comentario (requiere autenticación)
  eliminarComentario: async (comentarioId: number) => {
    const token = getToken();

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    try {
      const response = await fetch(`${API_URL}/${comentarioId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Enviar el token en los headers
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      throw error;
    }
  }
};
