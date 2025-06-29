import { useState, useEffect } from 'react';
import BaseConverterService from '../services/ejercicios';
import type { BaseConverter } from '../services/ejercicios';
import { 
  Code, 
  Calculator, 
  Search, 
  ClipboardList
} from 'lucide-react';

export interface ExerciseDisplay extends BaseConverter {
  type: string;
  completed: boolean;
  stars: number;
  estimatedTime: string;
  icon: React.ReactElement;
}

export const useExercises = () => {
  const [exercises, setExercises] = useState<ExerciseDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para determinar el tipo basado en el nombre del ejercicio
  const getExerciseType = (nombre: string): string => {
    const lowerName = nombre.toLowerCase();
    if (lowerName.includes('cipher') || lowerName.includes('cifrado')) return 'algoritmo';
    if (lowerName.includes('allerg') || lowerName.includes('math')) return 'matematico';
    if (lowerName.includes('tutorial') || lowerName.includes('hello')) return 'tutorial';
    return 'aprendizaje';
  };

  // Función para generar estrellas basado en la complejidad
  const getStars = (descripcion: string, requierePremium: boolean): number => {
    const complexity = descripcion.length;
    if (complexity < 200) return requierePremium ? 3 : 2;
    if (complexity < 400) return requierePremium ? 4 : 3;
    return requierePremium ? 5 : 4;
  };

  // Función para estimar tiempo basado en la descripción
  const getEstimatedTime = (descripcion: string, requierePremium: boolean): string => {
    const complexity = descripcion.length;
    let baseTime = 10;
    
    if (complexity > 300) baseTime = 25;
    else if (complexity > 200) baseTime = 15;
    
    if (requierePremium) baseTime += 10;
    
    return `${baseTime} min`;
  };

  // Función para generar iconos basado en el tipo
  const getIcon = (type: string, requierePremium: boolean): React.ReactElement => {
    const iconClass = "w-6 h-6 text-white";
    
    const gradientClass = requierePremium 
      ? "w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
      : "w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg";

    switch (type) {
      case 'algoritmo':
        return (
          <div className={gradientClass.replace('blue-400 to-blue-600', 'purple-400 to-purple-600')}>
            <Search className={iconClass} />
          </div>
        );
      case 'matematico':
        return (
          <div className={gradientClass.replace('blue-400 to-blue-600', 'green-400 to-green-600')}>
            <Calculator className={iconClass} />
          </div>
        );
      case 'tutorial':
        return (
          <div className={gradientClass}>
            <Code className={iconClass} />
          </div>
        );
      default:
        return (
          <div className={gradientClass.replace('blue-400 to-blue-600', 'indigo-400 to-indigo-600')}>
            <ClipboardList className={iconClass} />
          </div>
        );
    }
  };

  // Transformar ejercicio de API a formato de display
  const transformExercise = (exercise: BaseConverter): ExerciseDisplay => {
    const type = getExerciseType(exercise.nombre);
    const stars = getStars(exercise.descripcion, exercise.requierePremium);
    const estimatedTime = getEstimatedTime(exercise.descripcion, exercise.requierePremium);
    const icon = getIcon(type, exercise.requierePremium);

    return {
      ...exercise,
      type,
      completed: exercise.desbloqueado && Math.random() > 0.7, // Simular algunos completados
      stars,
      estimatedTime,
      icon
    };
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const apiExercises = await BaseConverterService.getAllBaseConverters();
        const transformedExercises = apiExercises.map(transformExercise);
        setExercises(transformedExercises);
        setError(null);
      } catch (err) {
        setError('Error al cargar los ejercicios');
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return { exercises, loading, error, refetch: () => setLoading(true) };
};