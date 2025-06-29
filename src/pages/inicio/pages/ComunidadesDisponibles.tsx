import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import imagenComunidades from "../../../assets/image.png";
import { useTheme } from "../../../context/theme/ThemeContext";
import type { Community } from "../models/Community";
import { useComunidades } from "../hooks/useComunidades";
import { ModalCrearComunidad } from "../components/ModalCrearComunidad";
import { useComunidadSeleccionada } from "../../Comunidad/hooks/useComunidadSeleccionada";
import { CommunityControls } from "../components/CommunityControls";
import { CommunityViewer } from "../components/CommunityViewer";
import { useCommunityFilter } from "../../../context/comunidadesdisponibles";
import { useApiRequest } from "../../../services/servicecomunidad";
import { useCommunityActions } from "../hooks/UseComunityaction"; // Importar el nuevo hook

export function ComunidadesDisponibles() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { setComunidad } = useComunidadSeleccionada();

  // Usar el contexto de filtros SOLO para comunidades disponibles
  const {
    availableCommunities,
    joinedCommunities,
    loading: contextLoading,
    error: contextError,
    getAvailableCommunities,
    refreshCommunities,
  } = useCommunityFilter();

  // Usar el servicio directo SOLO para comunidades inactivas
  const { getComunidadesPorEstado } = useApiRequest();

  // NUEVO: Usar el hook intermediario para las acciones de comunidad
  const {
    toggleEstadoComunidad,
    actualizarComunidad,
    loading: actionsLoading,
    error: actionsError
  } = useCommunityActions();

  const {
    agregarComunidad,
  } = useComunidades();

  // Estados para administración
  const [editarActivo, setEditarActivo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [comunidadEditar, setComunidadEditar] = useState<Community | null>(null);
  const [comunidadACambiarEstado, setComunidadACambiarEstado] = useState<Community | null>(null);
  const [mostrarListadas, setMostrarListadas] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);

  // Estados específicos para comunidades inactivas (manejo independiente)
  const [comunidadesInactivas, setComunidadesInactivas] = useState<Community[]>([]);
  const [loadingInactivas, setLoadingInactivas] = useState(false);
  const [errorInactivas, setErrorInactivas] = useState<string | null>(null);

  // Cargar comunidades disponibles al montar el componente
  useEffect(() => {
    getAvailableCommunities();
  }, [getAvailableCommunities]);

  // Cargar comunidades inactivas cuando se cambie a esa vista
  useEffect(() => {
    if (!mostrarListadas) {
      cargarComunidadesInactivas();
    }
  }, [mostrarListadas]);

  // Función específica para cargar comunidades inactivas
  const cargarComunidadesInactivas = async () => {
    setLoadingInactivas(true);
    setErrorInactivas(null);
    
    try {
      const comunidadesInactivasData = await getComunidadesPorEstado(0);
      setComunidadesInactivas(comunidadesInactivasData);
    } catch (error) {
      console.error("Error al cargar comunidades inactivas:", error);
      setErrorInactivas("Error al cargar comunidades inactivas");
    } finally {
      setLoadingInactivas(false);
    }
  };

  // Función para recargar datos según la vista actual
  const recargarDatosVista = async () => {
    if (mostrarListadas) {
      await refreshCommunities();
    } else {
      await cargarComunidadesInactivas();
    }
  };

  const toggleEditar = () => setEditarActivo((prev) => !prev);
  
  const toggleMostrarListadas = () => {
    setMostrarListadas((prev) => !prev);
    // Limpiar errores al cambiar de vista
    setErrorInactivas(null);
  };

  const handleAgregarClick = () => {
    setComunidadEditar(null);
    setModalVisible(true);
  };

  const handleEditarClick = (comunidad: Community) => {
    setComunidadEditar(comunidad);
    setModalVisible(true);
  };

  const handleComunidadClick = (comunidad: Community) => {
    setComunidad(comunidad);
    navigate('/Inicio/vistaprevia', { state: { comunidad } });
  };

  // FUNCIÓN PARA CREAR NUEVAS COMUNIDADES - OPTIMIZADA
  const handleComunidadCreada = async (datosComunidad: any, imagenFile?: File | null) => {
    if (!datosComunidad.nombre || datosComunidad.nombre.trim() === "") {
      return;
    }

    if (!datosComunidad.descripcion || datosComunidad.descripcion.trim() === "") {
      return;
    }

    try {
      setLoadingModal(true);
      
      const datosLimpios = {
        ...datosComunidad,
        nombre: datosComunidad.nombre.trim(),
        descripcion: datosComunidad.descripcion.trim()
      };

      // Crear la nueva comunidad
      const nuevaComunidad = await agregarComunidad(datosLimpios, imagenFile || undefined);

      // Cerrar modal antes de actualizar
      setModalVisible(false);
      setComunidadEditar(null);

      // Solo actualizar si la creación fue exitosa
      if (nuevaComunidad !== null && nuevaComunidad !== undefined) {
        // Actualizar la vista actual
        await recargarDatosVista();
      }
    } catch (error) {
      console.error("Error al crear comunidad:", error);
      // En caso de error, mantener el modal abierto para que el usuario pueda reintentar
    } finally {
      setLoadingModal(false);
    }
  };

  // FUNCIÓN PARA EDITAR COMUNIDADES EXISTENTES - ACTUALIZADA CON EL NUEVO HOOK
  const handleGuardarEdicion = async (datosActualizados: any, imagenFile?: File | null) => {
    if (!comunidadEditar) {
      return;
    }

    if (!datosActualizados.nombre || datosActualizados.nombre.trim() === "") {
      return;
    }

    if (!datosActualizados.descripcion || datosActualizados.descripcion.trim() === "") {
      return;
    }

    try {
      setLoadingModal(true);
      
      const nombreLimpio = datosActualizados.nombre.trim();
      const descripcionLimpia = datosActualizados.descripcion.trim();

      // Preparar datos para actualizar
      const datosParaActualizar = {
        nombre: nombreLimpio,
        descripcion: descripcionLimpia,
        urlLogo: comunidadEditar.urlLogo // Mantener logo actual si no hay nueva imagen
      };

      // Usar el nuevo hook para actualizar la comunidad
      const resultado = await actualizarComunidad(
        comunidadEditar.id, 
        datosParaActualizar,
        imagenFile || null
      );
      
      // Cerrar modal
      setModalVisible(false);
      setComunidadEditar(null);

      // Solo actualizar si la edición fue exitosa
      if (resultado !== null && resultado !== undefined) {
        await recargarDatosVista();
      }
    } catch (error) {
      console.error("Error al actualizar comunidad:", error);
      // En caso de error, mantener el modal abierto
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCambiarEstado = (comunidad: Community) => {
    const comunidadCompleta = {
      ...comunidad,
      nombre: comunidad.nombre || `Comunidad ${comunidad.id}`,
      descripcion: comunidad.descripcion || ""
    };

    setComunidadACambiarEstado(comunidadCompleta);
    setModalConfirmVisible(true);
  };

  // FUNCIÓN PARA CAMBIAR ESTADO - ACTUALIZADA CON EL NUEVO HOOK
  const confirmarCambioEstado = async () => {
    if (!comunidadACambiarEstado) return;

    try {
      setLoadingModal(true);
      
      // Usar el nuevo hook para cambiar el estado
      const resultado = await toggleEstadoComunidad(
        comunidadACambiarEstado.id, 
        comunidadACambiarEstado.estado
      );

      // Cerrar modal de confirmación
      setModalConfirmVisible(false);
      setComunidadACambiarEstado(null);

      // Solo actualizar si el cambio fue exitoso
      if (resultado !== null && resultado !== undefined) {
        await recargarDatosVista();
        console.log(`Estado de comunidad ${comunidadACambiarEstado.id} cambiado exitosamente`);
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la comunidad:", error);
      // Opcionalmente mostrar un mensaje de error al usuario
    } finally {
      setLoadingModal(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setComunidadEditar(null);
  };

  // Función para reintentar carga de comunidades
  const handleRetry = () => {
    recargarDatosVista();
  };

  // Obtener datos para mostrar según el estado actual
  const obtenerDatosVista = () => {
    if (mostrarListadas) {
      return {
        comunidades: availableCommunities,
        loading: contextLoading,
        error: contextError || actionsError, // Incluir errores del hook de acciones
        titulo: "Comunidades Disponibles para Unirse"
      };
    } else {
      return {
        comunidades: comunidadesInactivas,
        loading: loadingInactivas,
        error: errorInactivas || actionsError, // Incluir errores del hook de acciones
        titulo: "Comunidades Inactivas"
      };
    }
  };

  const { comunidades: comunidadesActuales, loading: loadingActual, error: errorActual, titulo } = obtenerDatosVista();

  // Combinar todos los estados de loading
  const isLoading = loadingActual || loadingModal || actionsLoading;

  // Obtener el userId de las comunidades unidas (solo para comunidades disponibles)
  const getUserId = (): number | null => {
    // Solo obtener userId cuando estamos viendo comunidades disponibles
    if (!mostrarListadas) return null;
    
    if (joinedCommunities.length === 0) return null;
    
    const firstCommunity = joinedCommunities[0];
    if (!firstCommunity.usuario) return null;
    
    if (typeof firstCommunity.usuario === 'number') {
      return firstCommunity.usuario;
    }
    
    if (typeof firstCommunity.usuario === 'object') {
      const userObj = firstCommunity.usuario as any;
      return userObj.id || userObj.userId || userObj.user_id || null;
    }
    
    return null;
  };

  const userId = getUserId();

  return (
    <div
      className={`min-h-screen w-full ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}
    >
      <div
        className={`p-8 max-w-7xl mx-auto ${isDarkMode ? "text-white" : "text-gray-900"}`}
      >
        <div className="mb-6">
          <img
            src={imagenComunidades}
            alt="Imagen horizontal comunidades"
            className="w-full h-40 object-cover rounded"
          />
        </div>

        <CommunityControls
          titulo={titulo}
          totalComunidades={comunidadesActuales.length}
          isLoading={isLoading}
          editarActivo={editarActivo}
          mostrarListadas={mostrarListadas}
          isDarkMode={isDarkMode}
          onAgregarClick={handleAgregarClick}
          onToggleEditar={toggleEditar}
          onToggleMostrarListadas={toggleMostrarListadas}
          onNavigateBack={() => navigate("/Inicio")}
        />

        <CommunityViewer
          comunidades={comunidadesActuales}
          isLoading={isLoading}
          error={errorActual}
          editarActivo={editarActivo}
          mostrarListadas={mostrarListadas}
          userId={userId}
          isDarkMode={isDarkMode}
          loadingMessage={loadingModal ? "Procesando comunidad..." : "Cargando comunidades..."}
          onComunidadClick={handleComunidadClick}
          onEditarClick={handleEditarClick}
          onCambiarEstado={handleCambiarEstado}
          onRetry={handleRetry}
        />

        {/* Modal de confirmación */}
        {modalConfirmVisible && comunidadACambiarEstado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              } rounded-lg p-6 max-w-md w-full mx-4`}
            >
              <h3 className="text-lg font-semibold mb-4">
                {comunidadACambiarEstado.estado === 1 ? "Desactivar" : "Activar"}{" "}
                Comunidad
              </h3>
              <p className="mb-6">
                ¿Estás seguro de que deseas{" "}
                {comunidadACambiarEstado.estado === 1 ? "desactivar" : "activar"}{" "}
                la comunidad{" "}
                <span className="font-semibold">
                  {comunidadACambiarEstado.nombre || `Comunidad ${comunidadACambiarEstado.id}`}
                </span>
                ?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setModalConfirmVisible(false);
                    setComunidadACambiarEstado(null);
                  }}
                  className={`px-4 py-2 rounded transition ${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarCambioEstado}
                  className={`px-4 py-2 rounded text-white transition ${
                    comunidadACambiarEstado.estado === 1
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-green-500 hover:bg-green-600"
                  } disabled:opacity-50`}
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : 
                   (comunidadACambiarEstado.estado === 1 ? "Desactivar" : "Activar")}
                </button>
              </div>
            </div>
          </div>
        )}

        <ModalCrearComunidad
          visible={modalVisible}
          onClose={handleModalClose}
          onCrear={comunidadEditar ? handleGuardarEdicion : handleComunidadCreada}
          isDarkMode={isDarkMode}
          comunidadInicial={comunidadEditar ?? undefined}
          onLoadingChange={setLoadingModal}
        />
      </div>
    </div>
  );
}