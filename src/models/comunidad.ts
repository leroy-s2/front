export interface Community {
  id: number;
  nombre: string;
  descripcion: string;
  urlLogo: string;
  id_creador: number;
  fecha_creacion: string; // en backend es LocalDate, aquí usaremos string "YYYY-MM-DD"
  estado: number;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
    keycloakId: string;
    recibirNotificaciones: boolean;
  };
}
