import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/theme/ThemeContext";
import { useComunidadSeleccionada } from "../../Comunidad/hooks/useComunidadSeleccionada";
import { useCommunity } from "../../../context/UserCommunitiesContext"; // Importar el contexto
import { communityService } from "../services/unetecomunidad";

export function CommunityInfo() {
  const { isDarkMode } = useTheme();
  const { comunidadSeleccionada } = useComunidadSeleccionada();
  const { refreshCommunities } = useCommunity(); // Usar el contexto para refrescar comunidades
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkMembership = async () => {
      if (!comunidadSeleccionada) return;

      try {
        const response = await communityService.checkIfUserIsInCommunity(comunidadSeleccionada.id);
        if (response.success) {
          setIsMember(response.data.toString() === 'true');
        } else {
          setIsMember(false);
        }
      } catch (error) {
        console.error('Error checking membership:', error);
        setIsMember(false);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [comunidadSeleccionada]);

  const handleJoinCommunity = async () => {
    if (!comunidadSeleccionada || actionLoading) return;
    
    setActionLoading(true);
    try {
      const response = await communityService.joinCommunity(comunidadSeleccionada.id);
      if (response.success) {
        setIsMember(true);
        // Refrescar las comunidades en el sidebar
        refreshCommunities();
        // Pequeña pausa para mostrar el cambio de estado antes de redirigir
        setTimeout(() => {
          navigate(`/comunidad/${comunidadSeleccionada.id}`);
        }, 500);
      }
    } catch (error) {
      console.error('Error joining community:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!comunidadSeleccionada || actionLoading) return;
    
    setActionLoading(true);
    try {
      const response = await communityService.leaveCommunity(comunidadSeleccionada.id);
      console.log('Leave community response:', response); // Debug
      
      if (response.success) {
        setIsMember(false);
        // Refrescar las comunidades en el sidebar
        refreshCommunities();
        console.log('Navigating to /Inicio/comunidadesdisponibles'); // Debug
        
        // Pequeña pausa para mostrar el cambio de estado antes de redirigir
        setTimeout(() => {
          navigate("/Inicio/comunidadesdisponibles", { replace: true });
        }, 500);
      } else {
        console.error('Leave community failed:', response);
      }
    } catch (error) {
      console.error('Error leaving community:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${
        isDarkMode 
          ? "bg-gradient-to-r from-gray-800 to-gray-700" 
          : "bg-gradient-to-r from-blue-100 to-blue-200"
      } px-8 py-6 rounded-xl shadow-lg mx-4 my-2`}>
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} text-lg`}>
            Verificando estado de la comunidad...
          </p>
        </div>
      </div>
    );
  }

  if (!comunidadSeleccionada) {
    return (
      <div className={`${
        isDarkMode 
          ? "bg-gradient-to-r from-gray-800 to-gray-700" 
          : "bg-gradient-to-r from-blue-100 to-blue-200"
      } px-8 py-6 rounded-xl shadow-lg mx-4 my-2`}>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} text-lg text-center`}>
          No hay comunidad seleccionada
        </p>
      </div>
    );
  }

  return (
    <div className={`${
      isDarkMode 
        ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600" 
        : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
    } px-8 py-6 rounded-xl shadow-lg border mx-4 my-2 transition-all duration-300 hover:shadow-xl`}>
      
      <div className="flex items-center justify-between">
        {/* Información de la comunidad */}
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDarkMode ? "bg-gray-600" : "bg-blue-300"
          }`}>
            <span className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-blue-800"}`}>
              {comunidadSeleccionada.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div>
            <h2 className={`${isDarkMode ? "text-white" : "text-gray-900"} text-2xl font-bold`}>
              {comunidadSeleccionada.nombre}
            </h2>
            
            {/* Badge de estado */}
            <div className="flex items-center mt-1">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                isMember === null
                  ? isDarkMode 
                    ? "bg-yellow-800 text-yellow-200 animate-pulse" 
                    : "bg-yellow-200 text-yellow-800 animate-pulse"
                  : isMember
                  ? isDarkMode 
                    ? "bg-green-800 text-green-200" 
                    : "bg-green-200 text-green-800"
                  : isDarkMode 
                    ? "bg-gray-600 text-gray-300" 
                    : "bg-gray-200 text-gray-700"
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isMember === null
                    ? "bg-yellow-400 animate-pulse"
                    : isMember
                    ? "bg-green-400"
                    : "bg-gray-400"
                }`}></div>
                {isMember === null
                  ? "Verificando..."
                  : isMember
                  ? "Miembro activo"
                  : "No eres miembro"}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center space-x-3">
          {isMember === false && (
            <button
              className={`group relative flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                actionLoading
                  ? isDarkMode
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-xl focus:ring-green-300"
                  : "bg-green-500 hover:bg-green-400 text-white shadow-lg hover:shadow-xl focus:ring-green-200"
              } ${actionLoading ? "" : "hover:shadow-green-500/25"}`}
              onClick={handleJoinCommunity}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span className="text-sm">UNIÉNDOSE...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm font-bold">UNIRSE</span>
                </>
              )}
            </button>
          )}

          {isMember === true && (
            <button
              className={`group relative flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                actionLoading
                  ? isDarkMode
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-xl focus:ring-red-300"
                  : "bg-red-500 hover:bg-red-400 text-white shadow-lg hover:shadow-xl focus:ring-red-200"
              } ${actionLoading ? "" : "hover:shadow-red-500/25"}`}
              onClick={handleLeaveCommunity}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span className="text-sm">ABANDONANDO...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-bold">ABANDONAR</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}