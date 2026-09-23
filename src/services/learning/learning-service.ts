import {
    Exercise,
    Evaluation,
    Topic,
} from '../../domain';
import { ExerciseDifficulty, CefrLevel, ExerciseType } from '../../../types';

import { ExerciseGenerator, CompetencyProgressRepo, LearnerErrorRepo } from '../../interfaces';
import { AnswerEvaluator } from '../../domain/answer-evaluator';
import { updateCompetencyProgress } from './update-competency-progress';
import { updateLearnerError } from './update-learner-error';
import { updateLearnerErrorSuccess } from './update-learning-error-success';
import { ExerciseGenerationContext } from '../../domain/exercise-generation-context';

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
        context: ExerciseGenerationContext,
    ): Promise<Exercise> {

        return this.exerciseGenerator.generate({
            level,
            type,
            difficulty,
            context,
        });
    }

    async evaluateAnswer(
        learnerId: string,
        exercise: Exercise,
        answer: string,
        assisted: boolean,
    ): Promise<Evaluation> {
        const evaluation = await this.answerEvaluator.evaluate({
            exercise,
            answer,
            assisted,
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
            if (competencyEvaluation.score > 0) {
                const learnerErrors =
                    await this.learnerErrorRepo.getByCompetency(
                        learnerId,
                        competencyEvaluation.competencyId,
                    );

                for (const learnerError of learnerErrors) {
                    const errorDetectedAgain =
                        evaluation.detectedErrors.some(
                            detectedError =>
                                detectedError.competencyId ===
                                learnerError.competencyId &&
                                detectedError.errorType ===
                                learnerError.errorType,
                        );

                    if (errorDetectedAgain) {
                        continue;
                    }

                    const updated =
                        updateLearnerErrorSuccess(learnerError);

                    await this.learnerErrorRepo.save(
                        learnerId,
                        updated,
                    );
                }
            }
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