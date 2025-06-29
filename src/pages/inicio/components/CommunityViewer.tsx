import type { Community } from "../models/Community";

interface CommunityViewerProps {
  comunidades: Community[];
  isLoading: boolean;
  error: string | null;
  editarActivo: boolean;
  mostrarListadas: boolean;
  userId: number | null;
  isDarkMode: boolean;
  loadingMessage: string;
  onComunidadClick: (comunidad: Community) => void;
  onEditarClick: (comunidad: Community) => void;
  onCambiarEstado: (comunidad: Community) => void;
  onRetry: () => void;
}

const colorRespaldo = "bg-gradient-to-r from-purple-600 to-blue-500";

export function CommunityViewer({
  comunidades,
  isLoading,
  error,
  editarActivo,
  mostrarListadas,
  userId,
  isDarkMode,
  loadingMessage,
  onComunidadClick,
  onEditarClick,
  onCambiarEstado,
  onRetry,
}: CommunityViewerProps) {
  const obtenerEstiloFondo = (comunidad: Community) => {
    if (comunidad.urlLogo && comunidad.urlLogo.trim() !== "") {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${comunidad.urlLogo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    return {};
  };

  const obtenerClaseRespaldo = (comunidad: Community) => {
    if (!comunidad.urlLogo || comunidad.urlLogo.trim() === "") {
      return colorRespaldo;
    }
    return "";
  };

  // Función auxiliar para obtener el nombre de la comunidad de forma segura
  const obtenerNombreComunidad = (comunidad: Community) => {
    return comunidad.nombre || `Comunidad ${comunidad.id}` || "Sin nombre";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {loadingMessage}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Empty state
  if (comunidades.length === 0) {
    return (
      <div className="text-center py-12">
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {mostrarListadas 
            ? "No hay comunidades disponibles para unirse" 
            : "No hay comunidades inactivas"
          }
        </p>
        {mostrarListadas && (
          <p className="text-sm text-gray-500 mt-2">
            {userId ? "¡Ya estás en todas las comunidades!" : "Cargando tu perfil..."}
          </p>
        )}
      </div>
    );
  }

  // Communities grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {comunidades.map((comunidad) => {
        const nombreComunidad = obtenerNombreComunidad(comunidad);
        
        return (
          <div
            key={comunidad.id}
            className={`${obtenerClaseRespaldo(
              comunidad
            )} rounded h-32 px-6 flex items-center justify-center text-white font-semibold cursor-pointer whitespace-nowrap text-center relative hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500`}
            style={obtenerEstiloFondo(comunidad)}
            title={comunidad.descripcion || nombreComunidad}
            onClick={() => onComunidadClick(comunidad)}
            role="button"
            tabIndex={0}
            aria-label={`${mostrarListadas ? 'Unirse a' : 'Ver'} la comunidad ${nombreComunidad}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onComunidadClick(comunidad);
              }
            }}
          >
            <span className="truncate max-w-full px-2 drop-shadow-lg">
              {nombreComunidad}
            </span>

            {/* Botones de edición - solo cuando está activo el modo editar */}
            {editarActivo && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditarClick(comunidad);
                  }}
                  className="p-1 rounded hover:bg-green-200/50 bg-white/20 backdrop-blur-sm"
                  title="Editar"
                  aria-label={`Editar ${nombreComunidad}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z"
                    />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Asegurarse de que la comunidad tenga todos los datos necesarios antes de pasarla
                    const comunidadCompleta = {
                      ...comunidad,
                      nombre: nombreComunidad // Garantizar que el nombre no sea null
                    };
                    onCambiarEstado(comunidadCompleta);
                  }}
                  className="p-1 rounded hover:bg-orange-200/50 bg-white/20 backdrop-blur-sm"
                  title={
                    comunidad.estado === 1
                      ? "Desactivar comunidad"
                      : "Activar comunidad"
                  }
                  aria-label={`${
                    comunidad.estado === 1 ? "Desactivar" : "Activar"
                  } ${nombreComunidad}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      comunidad.estado === 1
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {comunidad.estado === 1 ? (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.269-3.314m1.438-1.437A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.191 5.243"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 616 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 616 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}