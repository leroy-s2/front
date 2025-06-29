export type Seccion = {
  id_seccion: number;
  nombre: string;
  estado: "A" | "I" | string;
  orden: number;
  curso?: { id_curso: number };
  id_curso?: number;
};

export type SeccionDTO = {
  id_seccion?: number;
  nombre: string;
  estado: "A" | "I";
  orden: number;
  id_curso: number;
  curso?: { id_curso: number };
};