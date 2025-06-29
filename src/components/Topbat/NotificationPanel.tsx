import { FiBell } from 'react-icons/fi';
import { useTheme } from '../../context/theme/ThemeContext';
import { useEffect, useState } from 'react';
import { useNotifications } from '../UseNotifications'; // Importar el hook personalizado
import type { NotificacionUsuario, TipoNotificacion } from '../../models/Notificaciones';

interface NotificationPanelProps {
  mostrarNotificaciones: boolean;
  setMostrarNotificaciones: (value: boolean) => void;
}

export function NotificationPanel({
  mostrarNotificaciones,
  setMostrarNotificaciones,
}: NotificationPanelProps) {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState<'todos' | 'sin-leer'>('sin-leer');

  // Usar el hook personalizado
  const {
    notificaciones,
    loading,
    error,
    cargarNotificaciones,
    marcarComoLeida
  } = useNotifications(false); // Desactivar auto-refresh para controlarlo manualmente

  // Cargar notificaciones al montar el componente o cuando se muestre el panel
  useEffect(() => {
    if (mostrarNotificaciones) {
      cargarNotificaciones();
    }
  }, [mostrarNotificaciones, cargarNotificaciones]);

  useEffect(() => {
    if (mostrarNotificaciones) {
      setIsVisible(true);
      // Animar items después de que el panel aparezca
      setTimeout(() => setAnimateItems(true), 150);
    } else {
      setAnimateItems(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [mostrarNotificaciones]);

  const getIconoNotificacion = (tipo: TipoNotificacion) => {
    switch (tipo) {
      case 'MENSAJE':
        return '💬';
      case 'PROMOCION':
        return '🎉';
      case 'SISTEMA':
        return '⚙️';
      case 'ALERTA':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  const formatearTiempo = (fecha: string) => {
    try {
      const fechaNotificacion = new Date(fecha);
      const ahora = new Date();
      const diferencia = ahora.getTime() - fechaNotificacion.getTime();
      const minutos = Math.floor(diferencia / (1000 * 60));
      const horas = Math.floor(diferencia / (1000 * 60 * 60));
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

      if (minutos < 1) return 'Ahora';
      if (minutos < 60) return `Hace ${minutos}m`;
      if (horas < 24) return `Hace ${horas}h`;
      if (dias < 7) return `Hace ${dias}d`;
      return fechaNotificacion.toLocaleDateString();
    } catch {
      return fecha;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Solo cerrar si el click es directamente en el backdrop, no en sus hijos
    if (e.target === e.currentTarget) {
      setMostrarNotificaciones(false);
    }
  };

  const handlePanelClick = (e: React.MouseEvent) => {
    // Prevenir que los clics dentro del panel cierren el modal
    e.stopPropagation();
  };

  const handleNotificacionClick = async (notificacion: NotificacionUsuario) => {
    // Marcar como leída si no está leída
    if (notificacion.estadoNotificacion === 'NO_LEIDA') {
      await marcarComoLeida(notificacion.id);
    }
  };

  // Filtrar notificaciones según el filtro activo
  const notificacionesFiltradas = filtroActivo === 'sin-leer'
    ? notificaciones.filter(n => n.estadoNotificacion === 'NO_LEIDA')
    : notificaciones;

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop con animación de fade */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-300 ease-out ${mostrarNotificaciones
            ? (isDarkMode ? 'bg-black bg-opacity-50' : 'bg-gray-300 bg-opacity-40')
            : 'bg-transparent pointer-events-none'
          }`}
        onClick={handleBackdropClick}
      />

      {/* Panel de notificaciones con animación desde la derecha */}
      <div
        className={`fixed top-[72px] right-0 h-[calc(100vh-72px)] w-80 z-40 
          transform transition-all duration-300 ease-out flex flex-col
          ${mostrarNotificaciones ? 'translate-x-0' : 'translate-x-full'}
          ${isDarkMode
            ? 'bg-[#3B4252] text-white shadow-2xl'
            : 'bg-white text-gray-900 shadow-2xl border-l border-gray-200'}
        `}
        style={{
          backdropFilter: 'blur(10px)',
        }}
        onClick={handlePanelClick}
      >
        {/* Header con animación */}
        <div
          className={`flex-shrink-0 p-4 border-b transition-all duration-200 delay-100
            ${animateItems ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
            ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
          `}
        >
          <div className="flex justify-between items-center">
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Notificaciones
            </span>
            <button
              className={`p-1 rounded-full transition-all duration-200 hover:scale-110 ${isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              onClick={() => setMostrarNotificaciones(false)}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filtros con animación escalonada */}
        <div
          className={`flex-shrink-0 flex gap-2 p-4 border-b transition-all duration-200 delay-150
            ${animateItems ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
          style={{
            borderColor: isDarkMode ? 'rgba(107,114,128,1)' : '#d1d5db',
          }}
        >
          <button
            onClick={() => setFiltroActivo('sin-leer')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 transform
              ${filtroActivo === 'sin-leer'
                ? (isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg')
                : (isDarkMode
                  ? 'bg-transparent text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                  : 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400')
              }
            `}
          >
            Sin leer
          </button>
          <button
            onClick={() => setFiltroActivo('todos')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 transform
              ${filtroActivo === 'todos'
                ? (isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg')
                : (isDarkMode
                  ? 'bg-transparent text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                  : 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400')
              }
            `}
          >
            Todos
          </button>
        </div>

        {/* Lista de notificaciones con scroll mejorado */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin' }}>
          {loading ? (
            <div className={`flex flex-col items-center justify-center h-64 text-gray-400`}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-4"></div>
              <p>Cargando notificaciones...</p>
            </div>
          ) : error ? (
            <div className={`flex flex-col items-center justify-center h-64 text-red-400`}>
              <p className="text-center mb-4">{error}</p>
              <button
                onClick={cargarNotificaciones}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isDarkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
              >
                Reintentar
              </button>
            </div>
          ) : notificacionesFiltradas.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center h-64 text-gray-400 transition-all duration-300 delay-200
                ${animateItems ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}
            >
              <div className="animate-bounce">
                <FiBell className="text-4xl mb-4" />
              </div>
              <p className="text-center">
                {filtroActivo === 'sin-leer' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
              </p>
            </div>
          ) : (
            <div>
              {notificacionesFiltradas.map((notificacion, index) => (
                <div
                  key={notificacion.id}
                  className={`p-4 border-b cursor-pointer transition-all duration-300 hover:scale-[1.02] transform
                    ${animateItems ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                    ${isDarkMode
                      ? `border-gray-600 hover:bg-gray-700 hover:shadow-lg ${notificacion.estadoNotificacion === 'NO_LEIDA' ? 'bg-gray-600 border-l-4 border-l-blue-500' : ''
                      }`
                      : `border-gray-300 hover:bg-gray-50 hover:shadow-md ${notificacion.estadoNotificacion === 'NO_LEIDA' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`
                    }
                  `}
                  style={{
                    transitionDelay: `${200 + index * 50}ms`,
                  }}
                  onClick={() => handleNotificacionClick(notificacion)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 animate-pulse">
                      {getIconoNotificacion(notificacion.notificacion.tipoNotificacion)}
                    </span>
                    <div className="flex-1">
                      <h4 className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm font-medium mb-1`}>
                        {notificacion.notificacion.titulo}
                      </h4>
                      <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-sm leading-relaxed`}>
                        {notificacion.notificacion.contenido}
                      </p>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-1`}>
                        {formatearTiempo(notificacion.notificacion.fechaCreacion)}
                      </p>
                    </div>
                    {notificacion.estadoNotificacion === 'NO_LEIDA' && (
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 animate-pulse ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                            }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer opcional con contador */}
        <div
          className={`flex-shrink-0 p-3 border-t text-center text-xs transition-all duration-200 delay-300
            ${animateItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            ${isDarkMode
              ? 'border-gray-600 text-gray-400 bg-gray-800'
              : 'border-gray-300 text-gray-500 bg-gray-50'}
          `}
        >
          {notificaciones.length > 0 && (
            <span>
              {filtroActivo === 'sin-leer'
                ? `${notificacionesFiltradas.length} sin leer de ${notificaciones.length} total`
                : `${notificaciones.length} notificaciones`
              }
            </span>
          )}
        </div>
      </div>
    </>
  );
}