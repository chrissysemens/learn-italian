import { ExerciseDifficulty, CefrLevel, ExerciseType } from '../../types';


export interface Exercise {
  id: string;
  type: ExerciseType;
  level: CefrLevel;
  difficulty: ExerciseDifficulty;
  prompt: string;
  referenceAnswers: string[];
  competencyIds: string[];
  vocabularyIds: string[];
  topicId?: string;
}