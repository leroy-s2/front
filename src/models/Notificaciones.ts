// Definimos los tipos para las notificaciones y los estados asociados
export type EstadoNotificacion = 'LEIDA' | 'NO_LEIDA' | 'ELIMINADA';
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';
export type TipoNotificacion = 'SISTEMA' | 'PROMOCION' | 'ALERTA' | 'MENSAJE';

// Modelo para la Notificación
export interface Notificacion {
  id: number;
  titulo: string;
  contenido: string;
  fechaCreacion: string;  // Puede ser Date si se maneja como objeto de fecha
  prioridad: Prioridad;
  tipoNotificacion: TipoNotificacion;
}

// Modelo para la Notificación de Usuario
export interface NotificacionUsuario {
  id: number;
  idusuario: number;
  estadoNotificacion: EstadoNotificacion;
  fechaLectura: string | null;  // Puede ser Date si es un objeto de fecha
  notificacion: Notificacion;
}
