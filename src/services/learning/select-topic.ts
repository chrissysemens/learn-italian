import { Topic } from '../../domain';

export const selectTopic = (
  topics: Topic[],
): Topic => {
  if (topics.length === 0) {
    throw new Error(
      'Cannot select a topic from an empty list.',
    );
  }

  const index = Math.floor(
    Math.random() * topics.length,
  );

  return topics[index];
};