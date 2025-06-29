import { getToken } from '../../../context/auth/utils/authUtils';
import type { Publicacion } from "../models/Publicacion"; // Para la función GET
import type { PostPublicacion } from "../models/Publicacion"; // Para la función POST

export const publicacionesService = {
  // Función para obtener publicaciones de la comunidad
  async obtenerPublicacionesPorComunidad(comunidadId: number): Promise<Publicacion[]> {
    try {
      const response = await fetch(`http://localhost:8222/api/publicaciones/comunidad/${comunidadId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las publicaciones");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en el servicio de publicaciones:", error);
      throw error;
    }
  },

  // Función para crear una publicación con archivos
  async crearPublicacionConArchivos(publicacion: PostPublicacion, archivos: File[]): Promise<PostPublicacion> {
    try {
      const formData = new FormData();

      // Aquí estamos enviando el objeto 'publicacion' con 'contenido' y 'comunidad'
      formData.append('publicacion', JSON.stringify(publicacion));

      // Agregar los archivos al FormData si existen
      if (archivos && archivos.length > 0) {
        archivos.forEach((archivo) => {
          formData.append('archivos', archivo, archivo.name);
        });
      }

      // Enviar la solicitud con FormData
      const response = await fetch('http://localhost:8222/api/publicaciones/azure/con-archivos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`, // Autenticación con token
        },
        body: formData, // Enviar los datos como FormData
      });

      if (!response.ok) {
        const errorText = await response.text(); // Obtener el cuerpo de error como texto
        console.error('Error en la respuesta:', errorText);
        throw new Error(`Error al crear o actualizar la publicación: ${errorText}`);
      }

      const data = await response.json();
      return data; // Devolver la respuesta de la API
    } catch (error) {
      console.error("Error al crear o actualizar la publicación:", error);
      throw error;
    }
  },
};
