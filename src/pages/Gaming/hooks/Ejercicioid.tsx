import { useExerciseContext } from '../hooks/ExerciseContext';

export function useSelectedExercise() {
  const { selectedExerciseId, selectedExercise, setSelectedExercise, clearSelectedExercise } = useExerciseContext();

  return {
    selectedExerciseId,
    selectedExercise,
    setSelectedExercise,
    clearSelectedExercise,
  };
}