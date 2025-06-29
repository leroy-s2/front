import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Community } from "../models/Community";
import { useComunidadSeleccionada } from "../../Comunidad/hooks/useComunidadSeleccionada";
import { useCommunityFilter } from "../../../context/comunidadesdisponibles"; // Importar el contexto

type Props = {
  compact?: boolean;
  limit?: number;
};

// Color de respaldo si no hay imagen
const colorRespaldo = "bg-gradient-to-r from-purple-600 to-blue-500";

export function ComunidadesBasicas({ compact = false, limit = 4 }: Props) {
  const heightClass = compact ? "h-24" : "h-32";

  // Usar el contexto en lugar del estado local y servicios directos
  const {
    availableCommunities,
    loading: contextLoading,
    error: contextError,
    getAvailableCommunities,
    clearError
  } = useCommunityFilter();

  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setComunidad } = useComunidadSeleccionada();

  // Cargar las comunidades cuando el componente se monta
  useEffect(() => {
    const loadCommunities = async () => {
      try {
        clearError(); // Limpiar errores previos del contexto
        setLocalError(null); // Limpiar errores locales
        await getAvailableCommunities();
      } catch (err) {
        console.error("Error al cargar comunidades:", err);
        setLocalError("Error al cargar comunidades");
      }
    };

    loadCommunities();
  }, [getAvailableCommunities, clearError]);

  // Combinar errores del contexto y locales
  const error = contextError || localError;
  const loading = contextLoading;

  // Filtrar comunidades que tienen nombre válido
  const comunidadesFiltradas = availableCommunities.filter(
    comunidad => comunidad.nombre && comunidad.nombre.trim() !== ""
  );

  // Limitar la cantidad de comunidades a mostrar
  const comunidadesAMostrar = comunidadesFiltradas.slice(0, limit);

  // Función para obtener estilo de fondo (imagen si hay, o vacío)
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

  // Función para obtener clase de respaldo si no hay imagen
  const obtenerClaseRespaldo = (comunidad: Community) => {
    if (!comunidad.urlLogo || comunidad.urlLogo.trim() === "") {
      return colorRespaldo;
    }
    return "";
  };

  // Función para manejar el clic en una comunidad
  const handleComunidadClick = (comunidad: Community) => {
    setComunidad(comunidad); // Actualiza el contexto con la comunidad seleccionada
    navigate("/Inicio/vistaprevia");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div 
            key={i} 
            className={`animate-pulse bg-gray-300 rounded ${heightClass}`}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => {
            clearError();
            setLocalError(null);
            getAvailableCommunities();
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (comunidadesAMostrar.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay comunidades disponibles para unirse</p>
        <p className="text-sm text-gray-400 mt-2">
          ¡Ya estás en todas las comunidades disponibles!
        </p>
        <button 
          onClick={() => getAvailableCommunities()}
          className="mt-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
        >
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {comunidadesAMostrar.map((comunidad) => (
        <div
          key={comunidad.id}
          className={`${obtenerClaseRespaldo(comunidad)} rounded ${heightClass} px-4 flex items-center justify-center text-white font-semibold cursor-pointer text-center text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500`}
          style={obtenerEstiloFondo(comunidad)}
          title={comunidad.descripcion || comunidad.nombre}
          onClick={() => handleComunidadClick(comunidad)}
          role="button"
          tabIndex={0}
          aria-label={`Unirse a la comunidad ${comunidad.nombre}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleComunidadClick(comunidad);
            }
          }}
        >
          <span className="truncate max-w-full px-2 drop-shadow-lg">
            {comunidad.nombre}
          </span>
        </div>
      ))}
    </div>
  );
}