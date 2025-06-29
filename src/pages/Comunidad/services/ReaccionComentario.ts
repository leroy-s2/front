import { getToken } from '../../../context/auth/utils/authUtils';
import type {  } from '../models/reaccion'; // Importa el modelo de Comentario
const API_BASE_URL = 'http://localhost:8222/api/reaccion_comentario';

// Función para manejar las respuestas de la API
const handleResponse = async <T>(response: Response): Promise<{ success: boolean, data?: T, error?: string }> => {
  try {
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || `Error ${response.status}: ${response.statusText}` };
    }
  } catch (error) {
    return { success: false, error: 'Error al procesar la respuesta del servidor' };
  }
};

// Función para obtener el token de autenticación
const createAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

// Listar reacciones de un comentario
export const listarReaccionesPorComentario = async (comentarioId: number) => {
  const url = `${API_BASE_URL}/comentario/lista_total/${comentarioId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: createAuthHeaders()
  });
  return handleResponse<any[]>(response);
};

// Crear una nueva reacción en un comentario
export const crearReaccionEnComentario = async (tipoReaccion: 'LIKE' | 'DISLIKE' | 'LOVE' | 'ANGRY' | 'LAUGH', comentarioId: number) => {
  const url = `${API_BASE_URL}`;
  const body = JSON.stringify({
    tipo_reaccion: tipoReaccion,
    comentario: { id: comentarioId }
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: createAuthHeaders(),
    body
  });

  return handleResponse(response);
};

// Eliminar una reacción en un comentario
export const eliminarReaccionEnComentario = async (reaccionId: number) => {
  const url = `${API_BASE_URL}/${reaccionId}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: createAuthHeaders()
  });

  return handleResponse(response);
};
