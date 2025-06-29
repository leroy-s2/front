// src/services/userService.ts

import { getToken } from '../context/auth/utils/authUtils'; //con esto octengo el token

interface UserProfile {
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  pais: string;
  fechaNacimiento: string;
  id: number;
  keycloakId: string;
  idioma: string;
  fotoPerfil: string | null;
  biografia: string | null;
  tipoSuscripcion: string;
  recibirNotificaciones: boolean;
  fechaCreacion: string;
  estado: string;
}

//  "recibirNotificaciones"
export const getRecibirNotificaciones = async (): Promise<boolean | null> => {
  const userProfile = await getUserProfile();
  if (userProfile) {
    return userProfile.recibirNotificaciones; // Aquí se obtiene el valor de la variable recibirNotificaciones
  }
  return null;
};

// Función para obtener el perfil del usuario
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const token = getToken(); // Obtener el token desde el localStorage o contexto

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('http://localhost:8222/api/v1/usuarios/perfil_completo_con_idkeycloakId', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Agregar el token en las cabeceras
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching user profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Función para realizar el PATCH y cambiar el valor de recibirNotificaciones
export const toggleNotificaciones = async (): Promise<boolean | null> => {
  try {
    const token = getToken(); // Obtener el token desde el localStorage o contexto

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('http://localhost:8222/api/v1/usuarios/toggle-notificaciones', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Agregar el token en las cabeceras
      },
    });

    if (!response.ok) {
      throw new Error('Error toggling notification preference');
    }

    const data = await response.json();
    return data.recibirNotificaciones; // Suponiendo que la respuesta contenga el valor actualizado de recibirNotificaciones
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

