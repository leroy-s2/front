import { useState, useEffect } from "react";
import { FiSettings, FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/theme/ThemeContext";
import { removeToken } from "../../context/auth/utils/authUtils";
import { getRecibirNotificaciones, toggleNotificaciones } from "../../services/userService";

interface SettingsModalProps {
  mostrar: boolean;
  onClose: () => void;
}

export function SettingsModal({ mostrar, onClose }: SettingsModalProps) {
  const [seccionActiva, setSeccionActiva] = useState<"general" | "notificaciones">("general");
  const { tema, setTema, isDarkMode } = useTheme();
  const [idioma, setIdioma] = useState("español");
  const [notificacionesEmail, setNotificacionesEmail] = useState(false);
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(false);
  const navigate = useNavigate();

  // Cargar el estado inicial de las notificaciones cuando se abre el modal
  useEffect(() => {
    const cargarNotificaciones = async () => {
      if (mostrar) {
        try {
          const recibirNotificaciones = await getRecibirNotificaciones();
          if (recibirNotificaciones !== null) {
            setNotificacionesEmail(recibirNotificaciones);
          }
        } catch (error) {
          console.error('Error al cargar configuración de notificaciones:', error);
        }
      }
    };

    cargarNotificaciones();
  }, [mostrar]);

  const handleToggleNotificaciones = async () => {
    setLoadingNotificaciones(true);
    try {
      // Llamar a la API que hace toggle automático
      const nuevoEstado = await toggleNotificaciones();
      
      if (nuevoEstado !== null) {
        // Actualizar el estado local con el valor devuelto por la API
        setNotificacionesEmail(nuevoEstado);
      } else {
        console.error('Error al actualizar configuración de notificaciones');
      }
    } catch (error) {
      console.error('Error al cambiar configuración de notificaciones:', error);
    } finally {
      setLoadingNotificaciones(false);
    }
  };

  const cerrarSesion = () => {
    removeToken();
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
    console.log("Cerrando sesión...");
    onClose();
  };

  const eliminarCuenta = () => {
    console.log("Eliminando cuenta...");
    onClose();
  };

  if (!mostrar) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className={`${
          isDarkMode 
            ? 'bg-[#2E3440] text-white' 
            : 'bg-white text-gray-900'
        } rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden`}>
          <div className={`flex justify-between items-center p-4 border-b ${
            isDarkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            <h2 className="text-lg font-semibold">Configuración</h2>
            <button
              className={`${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              } text-xl`}
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="flex h-[500px]">
            <div className={`w-48 ${
              isDarkMode 
                ? 'bg-[#3B4252] border-gray-600' 
                : 'bg-gray-100 border-gray-300'
            } border-r`}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                  seccionActiva === "general" 
                    ? (isDarkMode ? 'bg-gray-600' : 'bg-gray-200') 
                    : ''
                } ${
                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
                onClick={() => setSeccionActiva("general")}
              >
                <FiSettings className="text-sm" />
                <span>General</span>
              </button>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                  seccionActiva === "notificaciones" 
                    ? (isDarkMode ? 'bg-gray-600' : 'bg-gray-200') 
                    : ''
                } ${
                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
                onClick={() => setSeccionActiva("notificaciones")}
              >
                <FiBell className="text-sm" />
                <span>Notificaciones</span>
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {seccionActiva === "general" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tema
                    </label>
                    <select
                      value={tema}
                      onChange={(e) => setTema(e.target.value as 'Sistema' | 'Claro' | 'Oscuro')}
                      className={`w-full ${
                        isDarkMode 
                          ? 'bg-[#3B4252] border-gray-600 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
                      } border rounded px-3 py-2 focus:outline-none`}
                    >
                      <option value="Sistema">Sistema</option>
                      <option value="Claro">Claro</option>
                      <option value="Oscuro">Oscuro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Idioma
                    </label>
                    <select
                      value={idioma}
                      onChange={(e) => setIdioma(e.target.value)}
                      className={`w-full ${
                        isDarkMode 
                          ? 'bg-[#3B4252] border-gray-600 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400'
                      } border rounded px-3 py-2 focus:outline-none`}
                    >
                      <option value="español">español</option>
                      <option value="english">english</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Eliminar cuenta
                    </label>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                      onClick={eliminarCuenta}
                    >
                      Eliminar Todo
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cerrar sesión en este dispositivo
                    </label>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                      onClick={cerrarSesion}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}

              {seccionActiva === "notificaciones" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Recibir notificaciones al correo
                      </label>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Recibe actualizaciones importantes en tu email
                      </p>
                    </div>
                    <button
                      onClick={handleToggleNotificaciones}
                      disabled={loadingNotificaciones}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        notificacionesEmail 
                          ? 'bg-blue-600' 
                          : isDarkMode 
                            ? 'bg-gray-600' 
                            : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificacionesEmail ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {loadingNotificaciones && (
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Actualizando configuración...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}