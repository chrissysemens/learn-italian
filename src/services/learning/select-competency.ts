import { CompetencyCandidate } from "../../domain/competency-candidate";


export const selectCompetency = (
  candidates: CompetencyCandidate[],
): string => {
  if (candidates.length === 0) {
    throw new Error(
      'Cannot select a competency from an empty list.',
    );
  }

  const totalWeight = candidates.reduce(
    (total, candidate) => total + candidate.weight,
    0,
  );

  let random = Math.random() * totalWeight;

  for (const candidate of candidates) {
    random -= candidate.weight;

    if (random <= 0) {
      return candidate.competencyId;
    }
  }

  return candidates[candidates.length - 1].competencyId;
};