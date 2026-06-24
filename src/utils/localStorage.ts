import type { Difficulty } from "../types/Difficulty";
import type { ReviewedAnswer } from "../types/UserAnswer";

const PROGRESS_KEY = "desafio-mundial-2026-progress";
const BEST_KEY = "desafio-mundial-2026-best";

export type GameMode = "all" | "groups" | "team";

export interface SavedProgress {
  difficulty: Difficulty;
  mode: GameMode;
  selectedTeam: string;
  currentIndex: number;
  reviews: ReviewedAnswer[];
  toleranceMinutes: boolean;
  soundEnabled: boolean;
  themeMode: "dark" | "light";
}

export interface BestScore {
  score: number;
  maxScore: number;
  percentage: number;
  difficulty: Difficulty;
  playedAt: string;
}

export function loadProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as SavedProgress) : null;
  } catch {
    return null;
  }
}

export function saveProgress(progress: SavedProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function clearProgress(): void {
  localStorage.removeItem(PROGRESS_KEY);
}

export function loadBestScore(): BestScore | null {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    return raw ? (JSON.parse(raw) as BestScore) : null;
  } catch {
    return null;
  }
}

export function saveBestScore(bestScore: BestScore): void {
  localStorage.setItem(BEST_KEY, JSON.stringify(bestScore));
}
