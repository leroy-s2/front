import axios from 'axios';
import { getToken } from '../context/auth/utils/authUtils';

// Definición unificada de tipos de reacción
export type ReactionType = "LIKE" | "DISLIKE" | "LOVE" | "ANGRY" | "LAUGH";

// Interface for the community data
interface Comunidad {
  id: number;
  nombre: string;
  descripcion: string;
  urlLogo: string;
  id_creador: number;
  fecha_creacion: string;
  estado: number;
}

// Interface for the publication data
interface Publicacion {
  id: number;
  id_usuario_publica: number;
  contenido: string;
  fecha_creacion: string;
  comunidad: Comunidad;
}

// Interface for reaction data
export interface Reaccion {
  id: number;
  id_usuario_reaccion: number;
  tipo_reaccion: ReactionType;
  publicacion: Publicacion;
}

// Function to get all reactions for publications in a community
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
