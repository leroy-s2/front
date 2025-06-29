// Modelo para un archivo adjunto
export interface Archivo {
  id: number;
  url_archivo: string;
  tipo_publicacion: "IMAGEN" | "VIDEO" | "DOCUMENTO"; // Puedes agregar más tipos según sea necesario
}

// Modelo para el autor (usuario)
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  keycloakId: string;
  recibirNotificaciones: boolean;
}

// Modelo para la Publicación
export interface Publicacion {
  id: number;
  id_usuario_publica: number;
  contenido: string;
  fecha_creacion: string;
  comunidad: {
    id: number;
    nombre: string | null;
    descripcion: string | null;
    urlLogo: string | null;
    id_creador: number | null;
    fecha_creacion: string | null;
    estado: number | null;
  };
  archivos: Archivo[]; // Aquí se incluyen los archivos adjuntos
  usuario: Usuario; // Aquí incluimos el autor
}

// Modelo para la publicación (se envía al backend)
export interface PostPublicacion {
  publicacion: {
    contenido: string;
    comunidad: {
      id: number;
    };
  };
  archivos?: Archivo[]; // Los archivos son opcionales
}