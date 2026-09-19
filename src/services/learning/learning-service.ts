import {
    CefrLevel,
    Exercise,
    ExerciseType,
    Evaluation,
} from '../../domain';
import { ExerciseDifficulty } from '../../../types';

import { ExerciseGenerator } from '../exercise/exercise-generator';
import { AnswerEvaluator } from '../exercise/answer-evaluator';
import { CompetencyProgressRepo } from '../../data/competency-progress-repo';
import { updateCompetencyProgress } from './update-confidence-progress';
import { LearnerErrorRepo } from '../../data/learner-error-repo';
import { updateLearnerError } from './update-learner-error';

export class LearningService {
    constructor(
        private readonly exerciseGenerator: ExerciseGenerator,
        private readonly answerEvaluator: AnswerEvaluator,
        private readonly competencyProgressRepo: CompetencyProgressRepo,
        private readonly learnerErrorRepo: LearnerErrorRepo,
    ) { }
    async generateExercise(
        level: CefrLevel,
        type: ExerciseType,
        difficulty: ExerciseDifficulty,
        competencyIds: string[],
    ): Promise<Exercise> {
        return this.exerciseGenerator.generate({
            level,
            type,
            difficulty,
            competencyIds,
        });
    }

    async evaluateAnswer(
        learnerId: string,
        exercise: Exercise,
        answer: string,
    ): Promise<Evaluation> {
        const evaluation = await this.answerEvaluator.evaluate({
            exercise,
            answer,
        });

        for (const competencyEvaluation of evaluation.competencyEvaluations) {
            const existing = await this.competencyProgressRepo.get(
                learnerId,
                competencyEvaluation.competencyId,
            );

            const progress = existing ?? {
                competencyId: competencyEvaluation.competencyId,
                mastery: 0,
                confidence: 0,
                attempts: 0,
            };

            const updated = updateCompetencyProgress(
                progress,
                competencyEvaluation.score,
                exercise.difficulty,
            );

            await this.competencyProgressRepo.save(
                learnerId,
                updated,
            );
        }

        for (const detectedError of evaluation.detectedErrors) {
            if (!detectedError.competencyId) {
                continue;
            }

            const existing = await this.learnerErrorRepo.get(
                learnerId,
                detectedError.competencyId,
                detectedError.errorType,
            );

            const updated = updateLearnerError(
                detectedError,
                existing,
            );

            await this.learnerErrorRepo.save(
                learnerId,
                updated,
            );
        }

        return evaluation;
    }
}