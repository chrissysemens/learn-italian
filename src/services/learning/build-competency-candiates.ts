import { Competency, CompetencyProgress, CompetencyCandidate, LearnerError } from "../../domain";

export const buildCompetencyCandidates = (
  competencies: Competency[],
  progress: CompetencyProgress[],
  learnerErrors: LearnerError[],
): CompetencyCandidate[] => {
  return competencies.map(competency => {
    const competencyProgress = progress.find(
      item => item.competencyId === competency.id,
    );

    const competencyErrors = learnerErrors.filter(
      error => error.competencyId === competency.id,
    );
    const masteryWeight = calculateMasteryWeight(
      competencyProgress?.mastery,
      competencyProgress?.confidence,
    );

    const errorWeight =
      calculateErrorWeight(competencyErrors);

    return {
      competencyId: competency.id,
      weight: masteryWeight * errorWeight,
    };
  });
};


const calculateMasteryWeight = (
  mastery?: number,
  confidence?: number,
): number => {
  if (
    mastery === undefined ||
    confidence === undefined
  ) {
    return 1;
  }

  const masteryAdjustment =
    (0.5 - mastery) * 0.4;

  const confidenceFactor =
    0.5 + (confidence * 0.5);

  return 1 + (
    masteryAdjustment * confidenceFactor
  );
};

const calculateErrorWeight = (
  errors: LearnerError[],
): number => {
  if (errors.some(error => error.status === 'active')) {
    return 1.15;
  }

  if (errors.some(error => error.status === 'improving')) {
    return 1.075;
  }

  return 1;
};
