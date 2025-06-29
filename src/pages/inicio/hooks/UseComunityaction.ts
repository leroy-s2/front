import { useCallback } from "react";
import { useApiRequest } from "../../../services/servicecomunidad";
import type{ Community, EditableCommunityFields } from "../../../services/servicecomunidad";
export interface UpdateCommunityData {
  nombre: string;
  descripcion: string;
  urlLogo?: string;
}

export const useCommunityActions = () => {
  const { 
    editarComunidad, 
    loading, 
    error,
    ...otherMethods 
  } = useApiRequest();

  /**
   * Alterna el estado de una comunidad entre activo (1) e inactivo (0)
   * @param id - ID de la comunidad
   * @param estadoActual - Estado actual de la comunidad
   * @returns Promise<Community> - Comunidad actualizada
   */
  const toggleEstadoComunidad = useCallback(async (
  id: number, 
  estadoActual: number
): Promise<Community> => {
  const nuevoEstado = estadoActual === 1 ? 0 : 1;
  
  try {
    // Solo enviamos el campo 'estado' y no los demás campos de la comunidad
    const comunidadActualizada = await editarComunidad(id, { 
      estado: nuevoEstado 
    });
    
    console.log(`Estado de comunidad ${id} cambiado de ${estadoActual} a ${nuevoEstado}`);
    return comunidadActualizada;
    
  } catch (error) {
    console.error('Error al cambiar estado de comunidad:', error);
    throw error;
  }
}, [editarComunidad]);


  /**
   * Actualiza los campos editables de una comunidad (nombre, descripción, logo)
   * @param id - ID de la comunidad
   * @param datosActualizados - Datos a actualizar
   * @param nuevaImagen - Archivo de imagen opcional (para actualizar el logo)
   * @returns Promise<Community> - Comunidad actualizada
   */
  const actualizarComunidad = useCallback(async (
    id: number,
    datosActualizados: UpdateCommunityData,
    nuevaImagen?: File | null
  ): Promise<Community> => {
    try {
      // Preparar los campos a editar
      const camposAEditar: EditableCommunityFields = {
        nombre: datosActualizados.nombre,
        descripcion: datosActualizados.descripcion,
      };

      // Solo incluir urlLogo si se proporciona y no hay nueva imagen
      if (datosActualizados.urlLogo && !nuevaImagen) {
        camposAEditar.urlLogo = datosActualizados.urlLogo;
      }

      const comunidadActualizada = await editarComunidad(
        id, 
        camposAEditar, 
        nuevaImagen
      );
      
      console.log(`Comunidad ${id} actualizada exitosamente`);
      return comunidadActualizada;
      
    } catch (error) {
      console.error('Error al actualizar comunidad:', error);
      throw error;
    }
  }, [editarComunidad]);

  /**
   * Función helper para activar una comunidad (estado = 1)
   * @param id - ID de la comunidad
   * @returns Promise<Community> - Comunidad actualizada
   */
  const activarComunidad = useCallback(async (id: number): Promise<Community> => {
    return editarComunidad(id, { estado: 1 });
  }, [editarComunidad]);

  /**
   * Función helper para desactivar una comunidad (estado = 0)
   * @param id - ID de la comunidad
   * @returns Promise<Community> - Comunidad actualizada
   */
  const desactivarComunidad = useCallback(async (id: number): Promise<Community> => {
    return editarComunidad(id, { estado: 0 });
  }, [editarComunidad]);

  return {
    // Métodos específicos del hook intermediario
    toggleEstadoComunidad,
    actualizarComunidad,
    activarComunidad,
    desactivarComunidad,
    
    // Estados compartidos
    loading,
    error,
    
    // Resto de métodos del hook original
    ...otherMethods
  };
};