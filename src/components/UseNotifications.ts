// UseNotifications.ts - Hook modificado con ordenamiento por fecha
import { useState, useEffect, useCallback } from 'react';
import { listarNotificaciones, editarEstadoNotificacion } from '../services/NotificacionService';
import type { NotificacionUsuario, EstadoNotificacion } from '../models/Notificaciones';

interface UseNotificationsReturn {
  notificaciones: NotificacionUsuario[];
  notificacionesNoLeidas: NotificacionUsuario[];
  contadorNoLeidas: number;
  loading: boolean;
  error: string | null;
  cargarNotificaciones: () => Promise<void>;
  marcarComoLeida: (idNotificacion: number) => Promise<void>;
  refrescar: () => Promise<void>;
}

// Crear un sistema de eventos simple para sincronización
class NotificationEventEmitter {
  private listeners: Array<() => void> = [];

  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  emit() {
    this.listeners.forEach(callback => callback());
  }
}

// Instancia global del emisor de eventos
const notificationEmitter = new NotificationEventEmitter();

// Función para ordenar notificaciones por fecha (más recientes primero)
const ordenarNotificacionesPorFecha = (notificaciones: NotificacionUsuario[]): NotificacionUsuario[] => {
  return [...notificaciones].sort((a, b) => {
    const fechaA = new Date(a.notificacion.fechaCreacion).getTime();
    const fechaB = new Date(b.notificacion.fechaCreacion).getTime();
    return fechaB - fechaA; // Orden descendente (más recientes primero)
  });
};

export function useNotifications(autoRefresh = true, intervalMs = 30000): UseNotificationsReturn {
  const [notificaciones, setNotificaciones] = useState<NotificacionUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarNotificaciones = useCallback(async () => {
    try {
      setError(null);
      const data = await listarNotificaciones();
      // Ordenar las notificaciones por fecha antes de guardarlas
      const notificacionesOrdenadas = ordenarNotificacionesPorFecha(data);
      setNotificaciones(notificacionesOrdenadas);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar notificaciones';
      setError(errorMessage);
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarComoLeida = useCallback(async (idNotificacion: number) => {
    try {
      // Actualizar el estado en la API
      await editarEstadoNotificacion(idNotificacion, 'LEIDA');

      // Actualizar el estado local de la notificación manteniendo el orden
      setNotificaciones(prev => {
        const notificacionesActualizadas = prev.map(notif =>
          notif.id === idNotificacion
            ? { ...notif, estadoNotificacion: 'LEIDA' as EstadoNotificacion }
            : notif
        );
        // Re-ordenar por si acaso (aunque el orden no debería cambiar)
        return ordenarNotificacionesPorFecha(notificacionesActualizadas);
      });

      // Emitir evento para sincronizar otras instancias del hook
      notificationEmitter.emit();
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
      throw err;
    }
  }, []);

  const refrescar = useCallback(async () => {
    setLoading(true);
    await cargarNotificaciones();
  }, [cargarNotificaciones]);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  // Suscribirse a eventos de cambio de otras instancias
  useEffect(() => {
    const unsubscribe = notificationEmitter.subscribe(() => {
      cargarNotificaciones();
    });
    return unsubscribe;
  }, [cargarNotificaciones]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(cargarNotificaciones, intervalMs);
    return () => clearInterval(interval);
  }, [autoRefresh, intervalMs, cargarNotificaciones]);

  // Computar valores derivados (ya están ordenados)
  const notificacionesNoLeidas = notificaciones.filter(
    n => n.estadoNotificacion === 'NO_LEIDA'
  );
  const contadorNoLeidas = notificacionesNoLeidas.length;

  return {
    notificaciones,
    notificacionesNoLeidas,
    contadorNoLeidas,
    loading,
    error,
    cargarNotificaciones,
    marcarComoLeida,
    refrescar,
  };
}