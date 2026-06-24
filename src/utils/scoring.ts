import type { Difficulty } from "../types/Difficulty";
import { maxPointsByDifficulty } from "../types/Difficulty";
import type { ReviewedAnswer, ScoreBreakdown } from "../types/UserAnswer";

export function getMaxScore(difficulty: Difficulty, matchCount = 1): number {
  return maxPointsByDifficulty[difficulty] * matchCount;
}

export function getScoreFromBreakdown(difficulty: Difficulty, breakdown: ScoreBreakdown): number {
  let score = breakdown.result ? 1 : 0;
  if (difficulty === "hard" || difficulty === "impossible") {
    score += breakdown.scorers ? 1 : 0;
  }
  if (difficulty === "impossible") {
    score += breakdown.minutes ? 1 : 0;
  }
  return score;
}

export function getPerfectAnswersCount(reviews: ReviewedAnswer[]): number {
  return reviews.filter((review) => review.score === review.maxScore).length;
}
