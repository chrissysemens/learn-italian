// src/services/learning/calculate-confidence.ts

const CONFIDENCE_PER_ATTEMPT = 0.1;

export const calculateConfidence = (
  currentConfidence: number,
): number => {
  return Math.min(
    1,
    currentConfidence + CONFIDENCE_PER_ATTEMPT,
  );
}