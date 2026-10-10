import { FsCompetencyProgressRepo } from '../../data/firestore/fs-comptency-progress-repo';
import { FsLearnerErrorRepo } from '../../data/firestore/fs-learner-error-repo';
import { FirebaseExerciseGenerator } from '../exercise/firebase-exercise-generator';
import { MockAnswerEvaluator } from '../exercise/mock-answer-evaluator';
import { LearningService } from './learning-service';

export const learningService = new LearningService(
  new FirebaseExerciseGenerator(),
  new MockAnswerEvaluator(),
  new FsCompetencyProgressRepo(),
  new FsLearnerErrorRepo(),
);

