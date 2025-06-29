import { useState, useEffect } from "react";
import type { Community } from "../models/Community";
import { getCommunities, createCommunity, updateCommunity } from "../services/communityService";

export function useComunidades() {
  const [comunidades, setComunidades] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar las comunidades desde el backend
  const cargarComunidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCommunities();
      setComunidades(data);
    } catch (err) {
      console.error("Error al cargar comunidades:", err);
      setError("Error al cargar las comunidades");
    } finally {
      setLoading(false);
    }
  };

  // Llamamos a cargarComunidades al montar el hook
  useEffect(() => {
    cargarComunidades();
  }, []);

  // Agregar una nueva comunidad
  const agregarComunidad = async (
  comunidad: Omit<Community, "id">,
  imagenFile?: File | null
) => {
  setLoading(true);
  setError(null);
  try {
    console.log("=== CREANDO COMUNIDAD ===");
    console.log("Datos comunidad:", comunidad);
    console.log("Imagen file:", imagenFile);

    const nuevaComunidad = await createCommunity(comunidad, imagenFile ?? null);

    // Actualizar el estado local inmediatamente sin llamar a recargarComunidades aquí
    setComunidades((prev) => [...prev, nuevaComunidad]);
    
    console.log("Comunidad creada exitosamente:", nuevaComunidad);
    
    // Después de crear, solo actualiza las comunidades sin recargar desde la API.
    return nuevaComunidad;
  } catch (err) {
    console.error("Error creando comunidad:", err);
    setError("Error al crear la comunidad");
    throw err;
  } finally {
    setLoading(false);
  }
};



  // FUNCIÓN ACTUALIZADA: Editar solo los campos especificados
  const editarComunidad = async (
  id: number,
  camposActualizacion: Partial<Omit<Community, "id">>, // Solo los campos que se quieren actualizar
  imagenFile?: File | null
) => {
  setLoading(true);
  setError(null);
  try {
    console.log("=== EDITANDO COMUNIDAD ===");
    console.log("ID:", id);
    console.log("Campos a actualizar:", camposActualizacion);
    console.log("Nueva imagen:", imagenFile);

    const comunidadActualizada = await updateCommunity(
      id,
      camposActualizacion,
      imagenFile ?? null
    );

    console.log("Respuesta del servicio:", comunidadActualizada);

    // Actualizar el estado local de las comunidades
    setComunidades((prev) =>
      prev.map((c) => (c.id === id ? comunidadActualizada : c))
    );

    console.log("Estado local actualizado");

    // Recargar las comunidades después de editar
    await recargarComunidades();  // Llamada para recargar las comunidades

    return comunidadActualizada;
  } catch (err) {
    console.error("Error al actualizar comunidad:", err);

    let mensajeError = "Error al actualizar comunidad";
    if (err instanceof Error) {
      mensajeError = err.message;
    }
    setError(mensajeError);
    throw new Error(mensajeError);
  } finally {
    setLoading(false);
  }
};


  // FUNCIÓN SIMPLIFICADA: Cambiar solo el estado
  const cambiarEstadoComunidad = async (id: number, nuevoEstado: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log("=== CAMBIANDO ESTADO COMUNIDAD ===");
      console.log("ID:", id);
      console.log("Nuevo estado:", nuevoEstado);

      // Solo actualizamos el campo estado
      const comunidadActualizada = await updateCommunity(
        id,
        { estado: nuevoEstado }, // Solo el campo estado
        null // Sin imagen nueva
      );

      console.log("Comunidad actualizada:", comunidadActualizada);

      // Actualizar inmediatamente el estado local
      setComunidades((prev) =>
        prev.map((c) => (c.id === id ? comunidadActualizada : c))
      );

      console.log("Estado local actualizado después del cambio de estado");
      return comunidadActualizada;
    } catch (err) {
      console.error("Error al cambiar estado de comunidad:", err);
      
      let mensajeError = "Error al cambiar el estado de la comunidad";
      
      if (err instanceof Error) {
        if (err.message.includes("401")) {
          mensajeError = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        } else if (err.message.includes("403")) {
          mensajeError = "No tienes permisos para modificar esta comunidad.";
        } else if (err.message.includes("404")) {
          mensajeError = "La comunidad no fue encontrada.";
        } else {
          mensajeError = err.message;
        }
      }
      
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN ADICIONAL: Editar solo el nombre
  const editarNombreComunidad = async (id: number, nuevoNombre: string) => {
    return await editarComunidad(id, { nombre: nuevoNombre });
  };

  // FUNCIÓN ADICIONAL: Editar solo la descripción
  const editarDescripcionComunidad = async (id: number, nuevaDescripcion: string) => {
    return await editarComunidad(id, { descripcion: nuevaDescripcion });
  };

  // FUNCIÓN ADICIONAL: Cambiar solo la imagen
  const cambiarImagenComunidad = async (id: number, nuevaImagen: File) => {
    return await editarComunidad(id, {}, nuevaImagen);
  };

  // Función para recargar manualmente las comunidades
  const recargarComunidades = async () => {
    console.log("Recargando comunidades...");
    await cargarComunidades();
  };

  // Función para refrescar comunidades (alias para compatibilidad)
  const refrescarComunidades = async () => {
    console.log("Refrescando comunidades...");
    await cargarComunidades();
  };

  return {
    comunidades,
    loading,
    error,
    agregarComunidad,
    editarComunidad,
    cambiarEstadoComunidad,
    editarNombreComunidad,
    editarDescripcionComunidad,
    cambiarImagenComunidad,
    recargarComunidades,
    refrescarComunidades,
  };
}