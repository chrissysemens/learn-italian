import {
    GenerateLessonRequest,
    NewLesson,
} from '../../domain';
import { LessonGenerator } from '../../interfaces';

export class MockLessonGenerator
    implements LessonGenerator {
    async generate(
        request: GenerateLessonRequest,
    ): Promise<NewLesson> {
        return {
            competencyIds:
                request.competencies.map(
                    competency => competency.id,
                ),
            topicId: request.topic.id,
            exerciseId: request.exercise.id,
            title: 'Present tense: fare',
            content:
                'Fare means "to do" or "to make". In the present tense: faccio, fai, fa, facciamo, fate, fanno.',
        };
    }
}