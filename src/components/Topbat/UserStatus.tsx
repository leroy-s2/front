import { useState, useEffect } from "react";
import { getUserProfile } from "../../services/userService";
import { actualizarPerfil } from "../../services/register";
import { crearPreferenciaPago } from "../../services/pagos"; // Importa el servicio

interface UserProfile {
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  pais: string;
  fechaNacimiento: string;
  id: number;
  keycloakId: string;
  idioma: string;
  fotoPerfil: string | null;
  biografia: string | null;
  tipoSuscripcion: string;
  recibirNotificaciones: boolean;
  fechaCreacion: string;
  estado: string;
}

// Interfaz para los datos de la preferencia de pago
interface PreferenceData {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  planId: number;
  nombrePlan: string;
  precio: number;
}

export default function UserStatus() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false); // Nuevo estado para carga de pago
  
  // Estados para los campos editables
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido: "",
    biografia: ""
  });

  // Estado para almacenar los datos de la preferencia
  const [preferenceData, setPreferenceData] = useState<PreferenceData | null>(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    fetchUserData();
  }, []);

  // Actualizar el formulario cuando cambian los datos del usuario
  useEffect(() => {
    if (userData) {
      setEditForm({
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        biografia: userData.biografia || ""
      });
    }
  }, [userData]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await getUserProfile();
      console.log(profile);
      if (profile) {
        setUserData(profile);
      } else {
        setError("No se pudo cargar la información del usuario");
      }
    } catch (err: any) {
      setError("Error al cargar los datos del usuario");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.nombre.trim() || !editForm.apellido.trim()) {
      setError("El nombre y apellido son obligatorios");
      return;
    }

    if (!userData?.id) {
      setError("No se puede actualizar el perfil: ID de usuario no disponible");
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      // Preparar los datos según la interfaz Actualizar del servicio
      const updateData = {
        nombre: editForm.nombre.trim(),
        apellido: editForm.apellido.trim(),
        biografia: editForm.biografia.trim() || null
      };

      await actualizarPerfil(updateData, userData.id.toString());
      
      // Actualizar los datos locales
      setUserData({
        ...userData,
        nombre: editForm.nombre.trim(),
        apellido: editForm.apellido.trim(),
        biografia: editForm.biografia.trim() || null
      });
      
      setIsEditMode(false);
      
    } catch (err: any) {
      setError("Error al guardar los cambios");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (userData) {
      setEditForm({
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        biografia: userData.biografia || ""
      });
    }
    setIsEditMode(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Función modificada para manejar el cambio de plan
  const handleUpgradePlan = async () => {
    // Si ya tenemos datos de preferencia, solo abrimos la nueva ventana
    if (preferenceData) {
      window.open('/mejora_tu_plan', '_blank');
      return;
    }

    setPaymentLoading(true);
    setError(null);
    
    try {
      // ID del plan - puedes ajustarlo según tu lógica de negocio
      // Por ejemplo, si el usuario actual es gratuito, podría ir al plan premium (ID = 2)
      const planId = 2; // Ajusta según tus planes disponibles
      
      const response = await crearPreferenciaPago(planId);
      
      if (response) {
        // Guardar los datos de la preferencia para usar en otra vista
        setPreferenceData(response);
        console.log('Preferencia creada:', response);
        
        // Aquí puedes decidir qué hacer con los datos:
        // Opción 1: Abrir la URL de MercadoPago directamente
        // window.open(response.initPoint, '_blank');
        
        // Opción 2: Navegar a tu vista personalizada con los datos
        window.open('/mejora_tu_plan', '_blank');
        
        // Opción 3: Guardar en localStorage para usar en otra vista
        localStorage.setItem('preferenceData', JSON.stringify(response));
        
      } else {
        setError("No se pudo crear la preferencia de pago");
      }
    } catch (err: any) {
      setError("Error al procesar el cambio de plan");
      console.error("Error creating payment preference:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      {/* Componente UserStatus clickeable */}
      <div
        className="flex items-center gap-2 border border-purple-500 rounded-full px-3 py-1 whitespace-nowrap cursor-pointer select-none hover:bg-purple-50 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white overflow-hidden">
          {userData?.fotoPerfil ? (
            <img
              src={userData.fotoPerfil}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-4 h-4 fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
            </svg>
          )}
        </div>
        <span>{userData?.username || "Usuario"}</span>
        <svg
          className="w-3 h-3 fill-purple-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path d="M96 192l128 128-128 128V192z" />
        </svg>
      </div>

      {/* Modal de información personal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white overflow-hidden">
                  {userData?.fotoPerfil ? (
                    <img
                      src={userData.fotoPerfil}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 fill-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {loading
                      ? "Cargando..."
                      : userData
                      ? `${userData.nombre} ${userData.apellido}`
                      : "Usuario"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    @{userData?.username || "usuario"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-gray-600">Cargando información...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                    <button onClick={fetchUserData} className="mt-2 text-sm text-purple-600 hover:text-purple-500">
                      Intentar de nuevo
                    </button>
                  </div>
                </div>
              ) : userData ? (
                <div className="space-y-4">
                  {/* Formulario de edición */}
                  {isEditMode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h3 className="text-sm font-medium text-blue-900 mb-3">Editar información personal</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={editForm.nombre}
                            onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Ingresa tu nombre"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Apellido
                          </label>
                          <input
                            type="text"
                            value={editForm.apellido}
                            onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Ingresa tu apellido"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Biografía
                          </label>
                          <textarea
                            value={editForm.biografia}
                            onChange={(e) => setEditForm({ ...editForm, biografia: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            placeholder="Cuéntanos algo sobre ti (opcional)"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {saving ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {/* Email */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm text-gray-900">{userData.email}</p>
                      </div>
                    </div>

                    {/* País */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">País</p>
                        <p className="text-sm text-gray-900">{userData.pais}</p>
                      </div>
                    </div>

                    {/* Biografía */}
                    {userData.biografia && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Biografía</p>
                          <p className="text-sm text-gray-900">{userData.biografia}</p>
                        </div>
                      </div>
                    )}

                    {/* Fecha de nacimiento */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fecha de nacimiento</p>
                        <p className="text-sm text-gray-900">
                          {formatDate(userData.fechaNacimiento)} ({calculateAge(userData.fechaNacimiento)} años)
                        </p>
                      </div>
                    </div>

                    {/* Suscripción */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          userData.tipoSuscripcion?.toLowerCase() === "premium"
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {userData.tipoSuscripcion?.toLowerCase() === "premium" ? (
                          <svg
                            className="w-4 h-4 text-yellow-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Suscripción</p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userData.tipoSuscripcion?.toLowerCase() === "premium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {userData.tipoSuscripcion?.toLowerCase() === "premium"
                              ? "✨ Premium"
                              : "🆓 Gratuita"}
                          </span>
                          <button
                            onClick={handleUpgradePlan}
                            disabled={paymentLoading}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {paymentLoading ? "Procesando..." : "Cambiar plan"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Nombre de usuario</p>
                        <p className="text-sm text-gray-900">@{userData.username}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer del modal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setError(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                {!isEditMode ? (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Editar perfil
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}