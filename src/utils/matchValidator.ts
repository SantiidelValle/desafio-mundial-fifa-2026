import type { Difficulty } from "../types/Difficulty";
import { maxPointsByDifficulty } from "../types/Difficulty";
import type { Goal } from "../types/Goal";
import type { Match } from "../types/Match";
import type { GoalGuess, ReviewedAnswer, ScoreBreakdown, UserAnswer } from "../types/UserAnswer";
import { normalizeText } from "./normalizeText";
import { getScoreFromBreakdown } from "./scoring";

const successMessages = [
  "¡Golazo mundialista!",
  "Respuesta digna de levantar la Copa.",
  "Modo campeón activado.",
  "Tenés memoria de leyenda.",
  "La clavaste al ángulo.",
  "Ni el VAR te saca esta."
];

const failMessages = [
  "Esa se fue por arriba del travesaño.",
  "Casi, pero no entró.",
  "Te faltó mirar el resumen.",
  "VAR revisando… respuesta incorrecta.",
  "Se te escapó en el minuto 90.",
  "Esa pelota terminó en la tribuna."
];

function distinctPlayers(goals: Goal[]): string[] {
  return Array.from(new Set(goals.map((goal) => normalizeText(goal.jugador))));
}

function nameCandidate(query: string, player: string): boolean {
  const normalizedQuery = normalizeText(query);
  const normalizedPlayer = normalizeText(player);
  const parts = normalizedPlayer.split(" ").filter(Boolean);
  const lastName = parts[parts.length - 1];

  if (!normalizedQuery) return false;
  if (normalizedPlayer === normalizedQuery) return true;
  if (lastName === normalizedQuery) return true;
  if (parts.includes(normalizedQuery)) return true;
  return normalizedPlayer.includes(normalizedQuery);
}

function isUnambiguousName(query: string, actualGoals: Goal[]): boolean {
  const matchingPlayers = distinctPlayers(actualGoals).filter((player) => nameCandidate(query, player));
  return matchingPlayers.length === 1;
}

function teamMatches(guess: GoalGuess, actual: Goal): boolean {
  if (!guess.equipo) return true;
  return normalizeText(guess.equipo) === normalizeText(actual.equipo);
}

function minuteToAbsolute(value: number | string | undefined): number | null {
  if (value === undefined || value === "") return null;
  const text = String(value).trim();
  const added = text.match(/^(\d{1,3})\s*\+\s*(\d{1,2})$/);
  if (added) {
    return Number(added[1]) + Number(added[2]);
  }
  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : null;
}

function minuteEquals(
  guessMinute: number | string | undefined,
  actualMinute: number | string,
  toleranceMinutes: boolean
): boolean {
  const guessRaw = normalizeText(String(guessMinute ?? ""));
  const actualRaw = normalizeText(String(actualMinute));
  if (!guessRaw) return false;
  if (guessRaw === actualRaw) return true;

  const guessAbsolute = minuteToAbsolute(guessMinute);
  const actualAbsolute = minuteToAbsolute(actualMinute);
  if (guessAbsolute === null || actualAbsolute === null) return false;

  return toleranceMinutes
    ? Math.abs(guessAbsolute - actualAbsolute) <= 1
    : guessAbsolute === actualAbsolute && !actualRaw.includes("+");
}

function matchGoals(
  actualGoals: Goal[],
  guesses: GoalGuess[],
  includeMinutes: boolean,
  toleranceMinutes: boolean
): boolean {
  const usableGuesses = guesses.filter((guess) => normalizeText(guess.jugador));
  if (actualGoals.length !== usableGuesses.length) return false;
  if (actualGoals.length === 0) return usableGuesses.length === 0;

  const matched = new Set<number>();

  return usableGuesses.every((guess) => {
    if (!isUnambiguousName(guess.jugador, actualGoals)) return false;

    const index = actualGoals.findIndex((actual, actualIndex) => {
      if (matched.has(actualIndex)) return false;
      if (!teamMatches(guess, actual)) return false;
      if (!nameCandidate(guess.jugador, actual.jugador)) return false;
      if (includeMinutes && !minuteEquals(guess.minuto, actual.minuto, toleranceMinutes)) return false;
      return true;
    });

    if (index === -1) return false;
    matched.add(index);
    return true;
  });
}

function pickMessage(perfect: boolean, matchId: number): string {
  const messages = perfect ? successMessages : failMessages;
  return messages[matchId % messages.length];
}

export function validateMatchAnswer(
  match: Match,
  answer: UserAnswer,
  difficulty: Difficulty,
  toleranceMinutes: boolean
): ReviewedAnswer {
  const resultCorrect =
    answer.localGoals === match.resultadoLocal &&
    answer.awayGoals === match.resultadoVisitante;

  const scorersCorrect =
    difficulty === "standard" ? true : matchGoals(match.goles, answer.goals, false, toleranceMinutes);

  const minutesCorrect =
    difficulty !== "impossible" ? true : matchGoals(match.goles, answer.goals, true, toleranceMinutes);

  const breakdown: ScoreBreakdown = {
    result: resultCorrect,
    scorers: scorersCorrect,
    minutes: minutesCorrect
  };

  const score = getScoreFromBreakdown(difficulty, breakdown);
  const maxScore = maxPointsByDifficulty[difficulty];

  return {
    matchId: match.id,
    difficulty,
    answer,
    score,
    maxScore,
    breakdown,
    message: pickMessage(score === maxScore, match.id)
  };
}
