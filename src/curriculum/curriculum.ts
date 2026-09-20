import { Competency } from '../domain';
import { CefrLevel } from '../../types';
import a1Competencies from './A1/competencies.json';

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