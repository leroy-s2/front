// types.ts
export type ReactionType = "like" | "love" | "laugh" | "angry";


// Definimos el tipo para los comentarios
export interface Comentario {
  id: number;
  id_usuario_comenta: number;
  comentario: string;
  fecha_creacion: string; // Debería ser un string con formato ISO
  publicacion: { id: number }; 
  
}

// Definimos el tipo para las publicaciones
export interface Publicacion {
  id: number;
  id_usuario_publica: number;
  contenido: string;
  fecha_creacion: string; // Debería ser un string con formato ISO
  comunidad: Comunidad;
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
