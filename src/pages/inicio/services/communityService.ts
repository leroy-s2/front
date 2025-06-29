import { getToken } from '../../../context/auth/utils/authUtils';
import type { Community } from "../models/Community";

const API_URL = "http://localhost:8222/api/comunidades";

// Crear comunidad (con autenticación previa)
export async function createCommunity(
  comunidad: { nombre: string; descripcion: string },
  imagenFile?: File | null
): Promise<Community> {
  console.log("=== INICIO createCommunity ===");
  console.log("Datos de comunidad:", comunidad);
  console.log("Archivo de imagen:", imagenFile);

  const token = getToken();

  if (!token) {
    throw new Error("No token found");
  }

  // VALIDACIÓN: Para CREAR, la imagen SÍ es obligatoria
  if (!imagenFile) {
    throw new Error("La imagen es obligatoria para crear una nueva comunidad");
  }

  const formData = new FormData();

  // Empaquetar los datos de la comunidad
  const comunidadData = {
    nombre: comunidad.nombre,
    descripcion: comunidad.descripcion,
  };

  console.log("Datos de comunidad para JSON:", comunidadData);
  formData.append("comunidad", JSON.stringify(comunidadData));

  // Agregar imagen al FormData
  console.log("Agregando imagen al FormData:", {
    name: imagenFile.name,
    size: imagenFile.size,
    type: imagenFile.type
  });
  formData.append("imagen", imagenFile);

  // DEBUG: Mostrar contenido del FormData
  console.log("Contenido del FormData:");
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  console.log("Enviando petición a:", API_URL);
  console.log("Headers:", { 'Authorization': `Bearer ${token}` });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("Respuesta recibida:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del servidor:", errorText);
      throw new Error(`Error al crear comunidad: ${response.status} - ${errorText}`);
    }

    const data: Community = await response.json();
    console.log("Datos de respuesta:", data);
    console.log("=== FIN createCommunity ===");
    return data;

  } catch (error) {
    console.error("Error en la petición:", error);
    throw error;
  }
}


// Función para obtener todas las comunidades
export async function getCommunities(): Promise<Community[]> {
  const response = await fetch(API_URL);  // Sin encabezado de autorización
  
  if (!response.ok) {
    throw new Error("Error al obtener comunidades");
  }

  const text = await response.text();
  
  if (!text) {
    throw new Error("Respuesta vacía del servidor");
  }

  const data: Community[] = JSON.parse(text);
  console.log("Comunidades obtenidas:", data);
  
  return data;
}


export async function getCommunitiesByEstado(estado: number): Promise<Community[]> {
  const response = await fetch(`${API_URL}/estado/${estado}`);  // Sin encabezado de autorización
  if (!response.ok) {
    throw new Error("Error al obtener comunidades por estado");
  }
  const data: Community[] = await response.json();
  return data;
}

// FUNCIÓN ACTUALIZADA: Permite edición parcial de campos - SIN validación obligatoria de imagen
export async function updateCommunity(
  id: number,
  camposActualizacion: Partial<Omit<Community, "id">>, // Solo los campos que se quieren actualizar
  imagenFile?: File | null
): Promise<Community> {
  const formData = new FormData();

  // Solo enviar los campos que se van a actualizar
  const comunidadParaJson = { ...camposActualizacion };

  console.log("=== ACTUALIZANDO COMUNIDAD ===");
  console.log("ID:", id);
  console.log("Campos a actualizar:", comunidadParaJson);
  console.log("Imagen:", imagenFile ? `${imagenFile.name} (${imagenFile.size} bytes)` : 'Sin cambio de imagen');

  // Agregar el objeto comunidad al FormData como JSON (solo si hay campos que actualizar)
  if (Object.keys(comunidadParaJson).length > 0) {
    formData.append("comunidad", JSON.stringify(comunidadParaJson));
  }

  // Si se ha proporcionado una imagen, agregarla al FormData
  if (imagenFile) {
    formData.append("imagen", imagenFile);
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
      // Si no requiere autenticación, eliminar encabezado de autorización
    });

    console.log("Respuesta recibida:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del servidor:", errorText);
      throw new Error(`Error al actualizar comunidad: ${response.status} - ${errorText}`);
    }

    const data: Community = await response.json();
    console.log("Comunidad actualizada exitosamente:", data);
    console.log("=== FIN ACTUALIZACIÓN ===");
    return data;
  } catch (error) {
    console.error("Error en la petición de actualización:", error);
    throw error;
  }
}

// Eliminar comunidad (sin necesidad de token)
export async function deleteCommunity(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    // Si no se requiere token, eliminar encabezado de autorización
  });

  if (!response.ok) {
    throw new Error("Error al eliminar comunidad");
  }
}
