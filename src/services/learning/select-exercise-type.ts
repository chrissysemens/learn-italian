import { ExerciseType } from "../../../types";

const exerciseTypes: ExerciseType[] = [
  'translate_en_it',
  'translate_it_en',
  'complete',
  'respond',
  'describe',
  'conversation',
  'review',
];

export const selectExerciseType = (): ExerciseType => {
  const index = Math.floor(
    Math.random() * exerciseTypes.length,
  );

  return exerciseTypes[index];
};