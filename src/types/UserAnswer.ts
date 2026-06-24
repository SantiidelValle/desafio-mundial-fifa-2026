import type { Difficulty } from "./Difficulty";

export interface GoalGuess {
  equipo: string;
  jugador: string;
  minuto?: number | string;
}

export interface UserAnswer {
  matchId: number;
  localGoals: number;
  awayGoals: number;
  goals: GoalGuess[];
}

export interface ScoreBreakdown {
  result: boolean;
  scorers: boolean;
  minutes: boolean;
}

export interface ReviewedAnswer {
  matchId: number;
  difficulty: Difficulty;
  answer: UserAnswer;
  score: number;
  maxScore: number;
  breakdown: ScoreBreakdown;
  message: string;
}
