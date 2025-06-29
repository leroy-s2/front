// Definición unificada de tipos de reacción
export type ReactionType = "LIKE" | "DISLIKE" | "LOVE" | "ANGRY" | "LAUGH";

export interface Publicacion {
  id: number;
}

export interface ReaccionPublicacion {
  tipo_reaccion: ReactionType;
  publicacion: Publicacion;
}

export interface ReaccionResponse {
  id: number;
  tipo_reaccion: ReactionType;
  publicacion: { id: number };
  id_usuario_reaccion: number; // NECESARIO para la lógica
  created_at?: string;
  updated_at?: string;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Definimos el tipo para los comentarios
export interface Comentario {
  id: number;
  id_usuario_comenta: number;
  comentario: string;
  fecha_creacion: string; // Debería ser un string con formato ISO
  publicacion: { id: number };
}



// Definimos el tipo para la comunidad
export interface Comunidad {
  id: number;
  nombre: string;
  descripcion: string;
  urlLogo: string;
  id_creador: number;
  fecha_creacion: string; // Debería ser un string con formato ISO
  estado: number;
}

// Interface for reaction data
export interface Reaccion {
  id: number;
  id_usuario_reaccion: number;
  tipo_reaccion: ReactionType;
  publicacion: {
    id: number;
  };
}