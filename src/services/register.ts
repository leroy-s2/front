import { getToken } from '../context/auth/utils/authUtils';

// URL de registro de usuario
const API_URL_REGISTER = "http://localhost:8222/api/v1/usuarios/register";

// URL de actualización de perfil, asegúrate de que la URL sea correcta para este caso
const API_URL_UPDATE_PROFILE = "http://localhost:8222/api/v1/usuarios/actualizar-perfil"; 

export async function registerUser(userData: {
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  pais: string;
  fechaNacimiento: string;
}): Promise<void> {
  try {
    const response = await fetch(API_URL_REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw error;
  }
}

// Modelo para edición de perfil
interface Actualizar {
  nombre: string;
  apellido: string;
  biografia: string | null; // Se espera un string o null en biografía
}

export async function actualizarPerfil(userData: Actualizar, userId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Token de autenticación no disponible');
  }

  // Validar si el userId es undefined o vacío
  if (!userId) {
    throw new Error('ID de usuario no válido');
  }

  const url = API_URL_UPDATE_PROFILE.replace("{id}", userId);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    throw error;
  }
}
