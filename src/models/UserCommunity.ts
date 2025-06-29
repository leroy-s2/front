// src/pages/inicio/models/UserCommunity.ts

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  keycloakId: string;
  recibirNotificaciones: boolean;
}

export interface Comunidad {
  id: number;
  nombre: string;
  descripcion: string;
  urlLogo: string;
  id_creador: number;
  usuario: Usuario | null;  // El usuario puede ser null, según la respuesta de la API
  fecha_creacion: string;  // Fecha en formato string (YYYY-MM-DD)
  estado: number;
}

export interface UserCommunity {
  id_usuario: number;
  usuario: Usuario;
  fecha_union: string;  // Fecha en formato string (YYYY-MM-DDTHH:MM:SS)
  comunidad: Comunidad;
}

