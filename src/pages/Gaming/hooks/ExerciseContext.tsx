import { createContext, useContext, useState } from 'react';
import type{ ReactNode } from 'react';

interface Exercise {
  id: string;
  nombre: string;
  descripcion: string;
  type: string;
  stars: number;
  estimatedTime: string;
  completed: boolean;
  desbloqueado: boolean;
  requierePremium: boolean;
  mensaje?: string;
  icon: ReactNode;
}

interface ExerciseContextType {
  selectedExerciseId: string | null;
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise) => void;
  clearSelectedExercise: () => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

interface ExerciseProviderProps {
  children: ReactNode;
}

export function ExerciseProvider({ children }: ExerciseProviderProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [selectedExercise, setSelectedExerciseState] = useState<Exercise | null>(null);

  const setSelectedExercise = (exercise: Exercise) => {
    setSelectedExerciseId(exercise.id);
    setSelectedExerciseState(exercise);
  };

  const clearSelectedExercise = () => {
    setSelectedExerciseId(null);
    setSelectedExerciseState(null);
  };

  const value = {
    selectedExerciseId,
    selectedExercise,
    setSelectedExercise,
    clearSelectedExercise,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExerciseContext() {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExerciseContext must be used within an ExerciseProvider');
  }
  return context;
}