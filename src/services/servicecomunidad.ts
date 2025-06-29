import { useState, useCallback } from "react";

// Obtener el token JWT del localStorage
export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem('authToken');
    console.log('Obteniendo token', { exists: !!token, length: token?.length });
    return token;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

export interface Community {
  id: number;
  nombre: string;
  descripcion: string;
  urlLogo: string;
  id_creador: number;
  fecha_creacion: string;
  estado: number;
}

// Interfaz para los campos editables - adaptada según lo requerido por el backend
export interface EditableCommunityFields {
  nombre?: string;
  descripcion?: string;
  urlLogo?: string;
  estado?: number;
}

// Interfaz exacta que espera el backend para editar una comunidad
interface Comunidad2 {
  nombre: string;
  descripcion: string;
  urlLogo: string;
  estado: number;
}


const API_URL = "http://localhost:8222/api/comunidades";

export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const method = options.method?.toUpperCase() || 'GET';
      const authToken = getToken();
      
      // Verificar autenticación para operaciones que la requieren
      if ((method === 'PUT' || method === 'POST') && !authToken) {
        throw new Error('Debe estar autenticado para realizar esta operación');
      }

      const headers: Record<string, string> = {};

      // Solo agregar token para POST y PUT (operaciones que lo requieren)
      if (authToken && (method === 'PUT' || method === 'POST')) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      // Manejar headers adicionales
      if (options.headers) {
        if (options.headers instanceof Headers) {
          options.headers.forEach((value, key) => {
            headers[key] = value;
          });
        } else if (Array.isArray(options.headers)) {
          options.headers.forEach(([key, value]) => {
            headers[key] = value;
          });
        } else {
          const headersObj = options.headers as Record<string, any>;
          Object.keys(headersObj).forEach(key => {
            if (typeof headersObj[key] === 'string') {
              headers[key] = headersObj[key];
            }
          });
        }
      }

      // CORRECCIÓN: Solo establecer Content-Type para JSON si NO es FormData
      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Verificar content-type antes de parsear JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      } else {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Error en la solicitud';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getComunidades = useCallback(async (): Promise<Community[]> => {
    try {
      const data = await makeRequest(API_URL, { method: "GET" });
      console.log('Comunidades obtenidas:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error al obtener comunidades:', error);
      return [];
    }
  }, [makeRequest]);

  // Nueva función para obtener comunidades por estado
  const getComunidadesPorEstado = useCallback(async (estado: number): Promise<Community[]> => {
    try {
      const data = await makeRequest(`${API_URL}/estado/${estado}`, { method: "GET" });
      console.log(`Comunidades con estado ${estado} obtenidas:`, data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error al obtener comunidades con estado ${estado}:`, error);
      return [];
    }
  }, [makeRequest]);

  // Función para obtener la comunidad existente antes de editarla
  const getComunidad = useCallback(async (id: number): Promise<Community | null> => {
    try {
      const data = await makeRequest(`${API_URL}/${id}`, { method: "GET" });
      return data;
    } catch (error) {
      console.error(`Error al obtener comunidad con ID ${id}:`, error);
      return null;
    }
  }, [makeRequest]);

  // Función mejorada para editar una comunidad
  const editarComunidad = useCallback(async (
    id: number, 
    camposAEditar: EditableCommunityFields,
    nuevaImagen?: File | null
  ): Promise<Community> => {
    const authToken = getToken();
    if (!authToken) {
      throw new Error('Debe estar autenticado para editar una comunidad');
    }

    try {
      // 1. Obtener los datos actuales de la comunidad para completar los campos no modificados
      const comunidadActual = await getComunidad(id);
      if (!comunidadActual) {
        throw new Error(`No se pudo obtener la comunidad con ID ${id}`);
      }

      // 2. Crear un objeto con todos los campos requeridos según la interfaz Comunidad2
      const comunidadCompleta: Comunidad2 = {
        nombre: camposAEditar.nombre !== undefined ? camposAEditar.nombre : comunidadActual.nombre,
        descripcion: camposAEditar.descripcion !== undefined ? camposAEditar.descripcion : comunidadActual.descripcion,
        urlLogo: camposAEditar.urlLogo !== undefined ? camposAEditar.urlLogo : comunidadActual.urlLogo,
        estado: camposAEditar.estado !== undefined ? camposAEditar.estado : comunidadActual.estado
      };

      console.log('Enviando datos completos para edición:', { 
        id, 
        datosOriginales: comunidadActual,
        camposModificados: camposAEditar,
        datosCompletos: comunidadCompleta,
        tieneImagen: !!nuevaImagen 
      });

      // 3. Usar FormData para enviar datos
      const formData = new FormData();
      
      // Importante: Agregar el objeto completo como JSON en un campo llamado 'comunidad'
      formData.append("comunidad", JSON.stringify(comunidadCompleta));
      
      // Agregar imagen si existe
      if (nuevaImagen) {
        formData.append("imagen", nuevaImagen);
      }

      const data = await makeRequest(`${API_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });

      console.log('Comunidad editada exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error al editar comunidad:', error);
      throw error;
    }
  }, [makeRequest, getComunidad]);

  const createCommunity = useCallback(async (community: { nombre: string; descripcion: string }, imagenFile?: File | null) => {
    // Verificar autenticación antes de proceder
    const authToken = getToken();
    if (!authToken) {
      throw new Error('Debe estar autenticado para crear una comunidad');
    }

    if (!imagenFile) {
      throw new Error("La imagen es obligatoria para crear una nueva comunidad");
    }

    const formData = new FormData();
    const comunidadData = { nombre: community.nombre, descripcion: community.descripcion };
    formData.append("comunidad", JSON.stringify(comunidadData));
    formData.append("imagen", imagenFile);

    try {
      const data = await makeRequest(API_URL, {
        method: "POST",
        body: formData,
      });
      console.log('Comunidad creada:', data);
      return data;
    } catch (error) {
      console.error('Error al crear comunidad:', error);
      throw error;
    }
  }, [makeRequest]);

  const buscarComunidadesPorNombre = useCallback(async (query: string): Promise<Community[]> => {
    try {
      const comunidades = await getComunidades();
      const queryLower = query.toLowerCase();
      return comunidades.filter(
        comunidad => comunidad.nombre.toLowerCase().includes(queryLower)
      );
    } catch (error) {
      console.error('Error al buscar comunidades:', error);
      return [];
    }
  }, [getComunidades]);

  return { 
    makeRequest, 
    getComunidades,
    getComunidadesPorEstado,
    editarComunidad,
    createCommunity, 
    buscarComunidadesPorNombre, 
    loading, 
    error 
  };
};