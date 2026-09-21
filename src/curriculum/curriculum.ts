import { Competency, Topic } from '../domain';
import { CefrLevel } from '../../types';
import a1Competencies from './A1/competencies.json';
import a1Topics from './A1/topics.json';

export const getCompetencies = (
  level: CefrLevel,
): Competency[] => {
  switch (level) {
    case 'A1':
      return a1Competencies as Competency[];

    default:
      return [];
  }
};

export const getTopics = (
  level: CefrLevel,
): Topic[] => {
  switch (level) {
    case 'A1':
      return a1Topics as Topic[];
    default:
      return [];
  }
};
