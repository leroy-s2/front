import type { SeccionDTO } from "./SeccionModels";
import type { Seccion } from "../models/SeccionModels"; // <-- Usa el tipo correcto

export function mapSeccionToDTO(seccion: Seccion): SeccionDTO {
  return {
    ...seccion,
    id_curso: seccion.curso?.id_curso ?? 0,
    // Asegura que estado sea "A" | "I"
    estado: seccion.estado === "A" || seccion.estado === "I" ? seccion.estado : "A",
  };
}