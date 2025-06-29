// models.ts

// Definimos los tipos para las reacciones
export type ReactionType = "LIKE" | "DISLIKE" | "LOVE" | "ANGRY";

// Modelo para la Publicación
export interface Publicacion {
  id: number;
  id_usuario_publica: number | null; // Puede ser nulo
  contenido: string | null; // Puede ser nulo
  fecha_creacion: string | null; // Puede ser nulo
  comunidad: any; // Puedes definir este tipo más específicamente dependiendo de tu estructura de comunidad
}

// Modelo para la Reacción a la Publicación
export interface ReaccionPublicacion {
  id: number;
  id_usuario_reaccion: number; // ID del usuario que reaccionó
  tipo_reaccion: ReactionType; // Tipo de reacción (LOVE, LIKE, etc.)
  publicacion: Publicacion; // La publicación a la que se hace la reacción
}
