import { getToken } from '../context/auth/utils/authUtils';
import type{ NotificacionUsuario, EstadoNotificacion } from '../models/Notificaciones'; // Importamos los modelos necesarios

const API_BASE_URL = 'http://localhost:8222/api/usuario_notificaciones';

// Utilidad para manejar respuestas HTTP
const handleResponse = async <T>(response: Response): Promise<T> => {
  try {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error('Error al procesar la respuesta del servidor');
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

// Servicio para obtener las notificaciones del usuario
export const listarNotificaciones = async (): Promise<NotificacionUsuario[]> => {
  const response = await fetch(`${API_BASE_URL}/notificaciones_del_usuario`, {
    method: 'GET',
    headers: createAuthHeaders(),
  });
  return handleResponse<NotificacionUsuario[]>(response);
};

// Servicio para editar el estado de una notificación
export const editarEstadoNotificacion = async (
  idNotificacion: number,
  estado: EstadoNotificacion
): Promise<NotificacionUsuario> => {
  const response = await fetch(`${API_BASE_URL}/editar/${idNotificacion}`, {
    method: 'PUT', // Cambiar a PUT si es necesario, dependiendo de cómo manejes la actualización en la API
    headers: createAuthHeaders(),
    body: JSON.stringify({ estadoNotificacion: estado }), // Esta es la estructura correcta para enviar el estado
  });
  return handleResponse<NotificacionUsuario>(response);
};
