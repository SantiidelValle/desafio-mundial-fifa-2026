export type Difficulty = "standard" | "hard" | "impossible";

export const difficultyLabels: Record<Difficulty, string> = {
  standard: "Estándar",
  hard: "Difícil",
  impossible: "Imposible"
};

export const maxPointsByDifficulty: Record<Difficulty, number> = {
  standard: 1,
  hard: 2,
  impossible: 3
};
