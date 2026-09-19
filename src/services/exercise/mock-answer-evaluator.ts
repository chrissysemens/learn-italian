import { Evaluation } from '../../domain';
import { AnswerEvaluator } from './answer-evaluator';
import { EvaluateAnswerRequest } from './evaluate-answer-request';

export class MockAnswerEvaluator implements AnswerEvaluator {
    async evaluate(
        request: EvaluateAnswerRequest,
    ): Promise<Evaluation> {
        return {
            score: 1.0,
            feedback: 'Great answer! You used the present tense of fare correctly.',
            competencyEvaluations: request.exercise.competencyIds.map(
                competencyId => ({
                    competencyId,
                    score: 1.0,
                }),
            ),
            detectedErrors: [
                {
                    id: 'error-1',
                    errorType: 'infinitive_instead_of_conjugated',
                    competencyId: 'a1-present-fare',
                    category: 'grammar',
                    range: {
                        start: 5,
                        end: 9,
                    },
                    learnerForm: 'fare',
                    correctedForm: 'fai',
                    explanation:
                        'Use the conjugated form "fai" for the second-person singular.',
                },
            ],
        };
    }
}