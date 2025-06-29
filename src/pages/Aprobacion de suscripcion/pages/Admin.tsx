import { useState, useEffect } from "react";
import { useTheme } from "../../../context/theme/ThemeContext";
import { 
  getTransaccionesPendientes, 
  getTodasTransacciones, 
  aprobarTransaccion 
} from '../services/apis'; // Ajusta la ruta según tu estructura

// Actualizar las interfaces para que coincidan con las de la API
interface Plan {
  precio: number;
  id: number;
  nombre: string;
}

interface Suscripcion {
  keycloakId: string;
  estado: string;
  fechaInicio: string;
  id: number;
  fechaFin: string;
  plan: Plan;
}

interface Transaccion {
  estado: string;
  monto: number;
  mercadoPagoId: string;
  suscripcion: Suscripcion;
  moneda: string;
  fechaCreacion: string;
  id: number;
  detalleError: string;
}

interface PaginaTransacciones {
  totalItems: number;
  transacciones: Transaccion[];
  totalPages: number;
  currentPage: number;
}

export function ContentConfirmacionPago() {
  const { isDarkMode } = useTheme();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pendientes: 0,
    todas: 0,
    completadas: 0
  });

  // Cargar transacciones al montar el componente
  useEffect(() => {
    cargarTransacciones();
  }, []);

  const cargarTransacciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data: PaginaTransacciones | null = null;
      
      if (filtroEstado === 'pendiente' || filtroEstado === 'todos') {
        // Cargar todas las transacciones para tener una vista completa
        data = await getTodasTransacciones();
      }
      
      if (data) {
        setTransacciones(data.transacciones);
        
        // Calcular estadísticas
        const pendientes = data.transacciones.filter(t => 
          t.estado.toLowerCase().includes('pendiente')
        ).length;
        const completadas = data.transacciones.filter(t => 
          t.estado.toLowerCase() === 'completada' || t.estado.toLowerCase() === 'aprobada'
        ).length;
        
        setStats({
          pendientes,
          todas: data.transacciones.length,
          completadas
        });
      } else {
        setError('No se pudieron cargar las transacciones');
      }
    } catch (err) {
      setError('Error al cargar las transacciones');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar solo transacciones pendientes cuando se selecciona el filtro
  const cargarTransaccionesPendientes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getTransaccionesPendientes();
      if (data) {
        setTransacciones(data.transacciones);
      } else {
        setError('No se pudieron cargar las transacciones pendientes');
      }
    } catch (err) {
      setError('Error al cargar las transacciones pendientes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar filtro y recargar datos si es necesario
  useEffect(() => {
    if (filtroEstado === 'pendiente') {
      cargarTransaccionesPendientes();
    } else if (filtroEstado === 'todos') {
      cargarTransacciones();
    }
  }, [filtroEstado]);

  const handleAprobar = async (transaccionId: number) => {
    try {
      await aprobarTransaccion(transaccionId);
      
      // Actualizar el estado local
      setTransacciones(prev => 
        prev.map(t => 
          t.id === transaccionId 
            ? { ...t, estado: 'aprobada' }
            : t
        )
      );
      
      // Recargar las transacciones para tener datos actualizados
      await cargarTransacciones();
      
    } catch (error) {
      console.error('Error al aprobar transacción:', error);
      setError('Error al aprobar la transacción');
    }
  };

  const getEstadoColor = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('pendiente')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (estadoLower === 'completada' || estadoLower === 'aprobada') {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (estadoLower === 'error' || estadoLower === 'fallida') {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getEstadoColorDark = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('pendiente')) {
      return 'bg-yellow-900 text-yellow-200 border-yellow-700';
    } else if (estadoLower === 'completada' || estadoLower === 'aprobada') {
      return 'bg-green-900 text-green-200 border-green-700';
    } else if (estadoLower === 'error' || estadoLower === 'fallida') {
      return 'bg-red-900 text-red-200 border-red-700';
    }
    return 'bg-gray-800 text-gray-200 border-gray-600';
  };

  const transaccionesFiltradas = transacciones.filter(t => {
    if (filtroEstado === 'todos') return true;
    if (filtroEstado === 'pendiente') return t.estado.toLowerCase().includes('pendiente');
    if (filtroEstado === 'completada') return t.estado.toLowerCase() === 'completada' || t.estado.toLowerCase() === 'aprobada';
    return t.estado.toLowerCase() === filtroEstado.toLowerCase();
  });

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMonto = (monto: number, moneda: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: moneda || 'USD'
    }).format(monto);
  };

  const obtenerNombreUsuario = (transaccion: Transaccion) => {
    // Como no tenemos el nombre del usuario en la respuesta, usar el keycloakId
    return transaccion.suscripcion?.keycloakId || 'Usuario desconocido';
  };

  const obtenerConcepto = (transaccion: Transaccion) => {
    return transaccion.suscripcion?.plan?.nombre || 'Suscripción';
  };

  // Función para formatear el mensaje del sistema
  const formatearMensajeSistema = (detalleError: string) => {
    if (!detalleError || detalleError.trim() === '') return null;
    
    // Si ya contiene "Sistema:", no agregarlo de nuevo
    if (detalleError.toLowerCase().includes('sistema:')) {
      return detalleError;
    }
    
    return `Sistema: ${detalleError}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Cargando transacciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"
      }`}
    >
      <div className="p-8 max-w-7xl mx-auto">
        {/* Barra superior */}
        <div
          className={`flex justify-between items-center mb-6 border rounded p-3 ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <div className={`flex items-center gap-2 text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Gestión de pagos
          </div>
          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {transaccionesFiltradas.length} transacciones
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={cargarTransacciones}
              className="ml-2 underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Título */}
        <h2
          className={`font-bold text-2xl mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Confirmación de Pagos
        </h2>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'pendiente', label: 'Pendientes' },
              { key: 'completada', label: 'Completadas' }
            ].map(filtro => (
              <button
                key={filtro.key}
                onClick={() => setFiltroEstado(filtro.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filtroEstado === filtro.key
                    ? isDarkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-600 hover:bg-gray-50 border"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de transacciones */}
        <div className="space-y-4">
          {transaccionesFiltradas.length === 0 ? (
            <div
              className={`text-center py-12 rounded-lg border ${
                isDarkMode 
                  ? "border-gray-700 bg-gray-800 text-gray-400" 
                  : "border-gray-200 bg-white text-gray-500"
              }`}
            >
              <svg
                className="w-12 h-12 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">No hay transacciones</p>
              <p className="text-sm">No se encontraron transacciones con el filtro seleccionado.</p>
            </div>
          ) : (
            transaccionesFiltradas.map((transaccion) => (
              <div
                key={transaccion.id}
                className={`rounded-lg border p-6 transition hover:shadow-md ${
                  isDarkMode 
                    ? "border-gray-700 bg-gray-800 hover:shadow-gray-900/20" 
                    : "border-gray-200 bg-white hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <h3 className={`font-semibold text-lg ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {obtenerNombreUsuario(transaccion)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border w-fit ${
                          isDarkMode 
                            ? getEstadoColorDark(transaccion.estado)
                            : getEstadoColor(transaccion.estado)
                        }`}
                      >
                        {transaccion.estado.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className={`font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Monto:
                        </span>
                        <p className={`font-bold text-lg ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}>
                          {formatearMonto(transaccion.monto, transaccion.moneda)}
                        </p>
                      </div>
                      
                      <div>
                        <span className={`font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Concepto:
                        </span>
                        <p className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                          {obtenerConcepto(transaccion)}
                        </p>
                      </div>
                      
                      <div>
                        <span className={`font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Método:
                        </span>
                        <p className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                          MercadoPago
                        </p>
                      </div>
                      
                      <div>
                        <span className={`font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Fecha:
                        </span>
                        <p className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                          {formatearFecha(transaccion.fechaCreacion)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div>
                        <span className={`text-xs font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                          ID MercadoPago: {transaccion.mercadoPagoId}
                        </span>
                      </div>
                      
                      {/* Mensaje del sistema mejorado */}
                      {formatearMensajeSistema(transaccion.detalleError) && (
                        <div className={`flex items-start gap-2 p-3 rounded-lg border-l-4 ${
                          isDarkMode 
                            ? "bg-blue-900/20 border-blue-500 text-blue-200" 
                            : "bg-blue-50 border-blue-400 text-blue-700"
                        }`}>
                          <svg 
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              isDarkMode ? "text-blue-400" : "text-blue-500"
                            }`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                          </svg>
                          <div className="text-xs">
                            <span className="font-medium">
                              {formatearMensajeSistema(transaccion.detalleError)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                    {transaccion.estado.toLowerCase().includes('pendiente') && (
                      <button
                        onClick={() => handleAprobar(transaccion.id)}
                        className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Aprobar
                      </button>
                    )}
                    
                    <button
                      className={`px-6 py-2 rounded-lg font-medium transition border ${
                        isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen estadístico */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Pendientes',
              valor: stats.pendientes,
              color: 'yellow'
            },
            {
              label: 'Total',
              valor: stats.todas,
              color: 'blue'
            },
            {
              label: 'Completadas',
              valor: stats.completadas,
              color: 'green'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`rounded-lg border p-4 text-center ${
                isDarkMode 
                  ? "border-gray-700 bg-gray-800" 
                  : "border-gray-200 bg-white"
              }`}
            >
              <p className={`text-2xl font-bold ${
                stat.color === 'yellow' 
                  ? "text-yellow-500"
                  : stat.color === 'blue'
                    ? "text-blue-500"
                    : "text-green-500"
              }`}>
                {stat.valor}
              </p>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}