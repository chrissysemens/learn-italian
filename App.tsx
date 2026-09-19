import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FsLearnerErrorRepo } from './src/data/firestore/fs-learner-error-repo';
import { FSLearnerRepo } from './src/data/firestore/fs-learner-repo';
import { FsCompetencyProgressRepo } from './src/data/firestore/fs-comptency-progress-repo';
import { CompetencyProgress, DetectedError } from './src/domain';
import { Learner } from './src/domain/learner';
import { env } from './src/config/env';
import { MockAnswerEvaluator } from './src/services/exercise/mock-answer-evaluator';
import { MockExerciseGenerator } from './src/services/exercise/mock-exercise-generator';
import { LearningService } from './src/services/learning/learning-service';
import { updateLearnerError } from './src/services/learning/update-learner-error';
import { updateCompetencyProgress } from './src/services/learning/update-mastery-progress';

const learnerRepo = new FSLearnerRepo();
const learnerErrorRepo = new FsLearnerErrorRepo();


const learningService = new LearningService(
  new MockExerciseGenerator(),
  new MockAnswerEvaluator(),
  new FsCompetencyProgressRepo(),
  learnerErrorRepo,
);

export default function App() {
  const [learner, setLearner] = useState<Learner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLearner = async () => {
      try {
        if (!env.learnerId) {
          throw new Error('EXPO_PUBLIC_LEARNER_ID is not configured.');
        }

        setLearner(await learnerRepo.get(env.learnerId));
      } catch (loadError) {
        setError(loadError instanceof Error
          ? loadError
          : new Error('Unable to load learner.'));
      } finally {
        setLoading(false);
      }
    };

    loadLearner();
  }, []);

  useEffect(() => {
    const run = async () => {
      const exercise = await learningService.generateExercise(
        'A1',
        'translate_en_it',
        'standard',
        ['a1-present-fare'],
      );

      console.log('EXERCISE', exercise);

      const evaluation = await learningService.evaluateAnswer(
        env.learnerId,
        exercise,
        'Cosa fai sabato?',
      );

      console.log('EVALUATION', evaluation);

      const detectedError: DetectedError = {
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
      };

      const existing = await learnerErrorRepo.get(
        env.learnerId,
        detectedError.competencyId!,
        detectedError.errorType,
      );
      const updated = updateLearnerError(detectedError, existing);

      await learnerErrorRepo.save(env.learnerId, updated);
      console.log('Learner error:', updated);
    };

    run().catch(console.error);
  }, []);

  const progress: CompetencyProgress = {
    competencyId: 'a1-present-fare',
    mastery: 0.5,
    confidence: 0,
    attempts: 4,
  };

  console.log(updateCompetencyProgress(progress, 1.0, 'standard'));

  return (
    <View style={styles.container}>
      {loading && <Text>Loading learner...</Text>}
      {error && <Text>Unable to load learner: {error.message}</Text>}
      {!loading && !error && !learner && (
        <Text>No learner found for the configured document ID.</Text>
      )}
      {learner && (
        <Text>
          Ciao {learner.firstName}! Level: {learner.currentLevel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});