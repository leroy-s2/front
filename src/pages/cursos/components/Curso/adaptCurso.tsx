import type { CursoDto, CursoSimple } from '../../models/CursoDto';
import type { Course } from './CourseCard';

// Adaptador para CursoDto o CursoSimple a Course
export function adaptCursoDtoToCourse(dto: Partial<CursoDto & CursoSimple>): Course {
  return {
    id: dto.id_curso ?? 0,
    title: dto.nombre ?? "",
    instructor: dto.usuario?.nombre ?? "Desconocido",
    image: dto.url_imagen || "https://placeholder.pics/svg/400x225", // O cambia por un placeholder propio
    isCodingShare: true,
    isNew: false,
  };
}