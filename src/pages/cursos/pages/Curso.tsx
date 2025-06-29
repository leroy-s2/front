import { useEffect, useState } from 'react';
import Banner from '../../cursos/components/Curso/Banner';
import ScrollableSection from '../../cursos/components/Curso/ScrollableSection';
import { useLenguajes } from '../hooks/useLenguajesActivos';
import { getCursosPorLenguaje, getCursosRecientes } from '../services/cursosApi';
import { adaptCursoDtoToCourse } from '../../cursos/components/Curso/adaptCurso';
import { useTheme } from '../../../context/theme/ThemeContext';
import type { CursoSimple } from '../models/CursoDto';
import type { Course } from '../components/Curso/CourseCard';
import type { LenguajeDto } from '../models/LenguajeDto';

const CoursePlatform: React.FC = () => {
  const { data: lenguajes, loading: loadingLenguajes } = useLenguajes();
  const { isDarkMode } = useTheme();
  const [selectedLenguajes, setSelectedLenguajes] = useState<number[]>([]);
  const [cursosPorLenguaje, setCursosPorLenguaje] = useState<Record<number, Course[]>>({});
  const [cursosRecientes, setCursosRecientes] = useState<Course[]>([]);
  const [loadingRecientes, setLoadingRecientes] = useState(true);

  useEffect(() => {
    if (lenguajes && lenguajes.length) {
      setSelectedLenguajes(lenguajes.map((l: LenguajeDto) => l.id_lenguaje));
    }
  }, [lenguajes]);

  useEffect(() => {
    const fetchCursos = async () => {
      const all: Record<number, Course[]> = {};
      for (const idLenguaje of selectedLenguajes) {
        const cursosDto: CursoSimple[] = await getCursosPorLenguaje(idLenguaje);
        all[idLenguaje] = cursosDto.map(adaptCursoDtoToCourse);
      }
      setCursosPorLenguaje(all);
    };
    if (selectedLenguajes.length) fetchCursos();
  }, [selectedLenguajes]);

  useEffect(() => {
    setLoadingRecientes(true);
    getCursosRecientes()
      .then(dtos => setCursosRecientes(dtos.map(adaptCursoDtoToCourse)))
      .finally(() => setLoadingRecientes(false));
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  if (loadingLenguajes || loadingRecientes) {
    return (
      <div className={`p-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Cargando...
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${
      isDarkMode ? "bg-gray-900" : "bg-blue-50"
    }`}>
      <Banner onBack={handleBack} />
      
      {/* Cursos recomendados */}
      <div className="mb-8">
        <h2 className={`text-lg font-semibold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>
          Cursos recomendados para ti
        </h2>
        {selectedLenguajes[0] !== undefined && cursosPorLenguaje[selectedLenguajes[0]] && (
          <ScrollableSection courses={cursosPorLenguaje[selectedLenguajes[0]]} />
        )}
      </div>
      
      {/* Cursos por lenguaje */}
      <div className="space-y-8">
        {selectedLenguajes.map((id: number) => (
          <div key={id}>
            <h2 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Lenguaje de Programación: {
                lenguajes?.find((l: LenguajeDto) => l.id_lenguaje === id)?.nombre
              }
            </h2>
            <ScrollableSection courses={cursosPorLenguaje[id] || []} />
          </div>
        ))}
      </div>
      
      {/* Últimos cursos lanzados */}
      <div className="mt-10">
        <h2 className={`text-lg font-semibold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>
          Últimos cursos lanzados
        </h2>
        <ScrollableSection courses={cursosRecientes || []} />
      </div>
      
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default CoursePlatform;