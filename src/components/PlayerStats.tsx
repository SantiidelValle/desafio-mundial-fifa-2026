import { Flame, Frown, Goal, Medal, Percent, Target, type LucideIcon } from "lucide-react";
import type { Difficulty } from "../types/Difficulty";
import { difficultyLabels } from "../types/Difficulty";
import type { Match } from "../types/Match";
import type { ReviewedAnswer } from "../types/UserAnswer";
import { calculateRank } from "../utils/calculateRank";
import { getPerfectAnswersCount } from "../utils/scoring";

interface PlayerStatsProps {
  reviews: ReviewedAnswer[];
  matches: Match[];
  difficulty: Difficulty;
}

function streaks(reviews: ReviewedAnswer[]) {
  let best = 0;
  let worst = 0;
  let currentBest = 0;
  let currentWorst = 0;

  reviews.forEach((review) => {
    const perfect = review.score === review.maxScore;
    if (perfect) {
      currentBest += 1;
      currentWorst = 0;
    } else {
      currentWorst += 1;
      currentBest = 0;
    }
    best = Math.max(best, currentBest);
    worst = Math.max(worst, currentWorst);
  });

  return { best, worst };
}

function teamTrends(reviews: ReviewedAnswer[], matches: Match[]) {
  const table = new Map<string, { hits: number; misses: number }>();

  reviews.forEach((review) => {
    const match = matches.find((candidate) => candidate.id === review.matchId);
    if (!match) return;
    [match.equipoLocal, match.equipoVisitante].forEach((team) => {
      const entry = table.get(team) ?? { hits: 0, misses: 0 };
      if (review.score === review.maxScore) entry.hits += 1;
      else entry.misses += 1;
      table.set(team, entry);
    });
  });

  const sortedByHits = [...table.entries()].sort((a, b) => b[1].hits - a[1].hits);
  const sortedByMisses = [...table.entries()].sort((a, b) => b[1].misses - a[1].misses);

  return {
    bestTeam: sortedByHits[0]?.[1].hits ? sortedByHits[0][0] : "Sin aciertos completos",
    worstTeam: sortedByMisses[0]?.[1].misses ? sortedByMisses[0][0] : "Sin fallos"
  };
}

export default function PlayerStats({ reviews, matches, difficulty }: PlayerStatsProps) {
  const points = reviews.reduce((total, review) => total + review.score, 0);
  const max = reviews.reduce((total, review) => total + review.maxScore, 0);
  const percentage = max > 0 ? Math.round((points / max) * 100) : 0;
  const perfectCount = getPerfectAnswersCount(reviews);
  const { best, worst } = streaks(reviews);
  const { bestTeam, worstTeam } = teamTrends(reviews, matches);
  const statCards: Array<{ label: string; value: string | number; Icon: LucideIcon }> = [
    { label: "Partidos jugados", value: reviews.length, Icon: Target },
    { label: "Acertados completos", value: perfectCount, Icon: Medal },
    { label: "Porcentaje", value: `${percentage}%`, Icon: Percent },
    { label: "Mejor racha", value: best, Icon: Flame },
    { label: "Peor racha", value: worst, Icon: Frown },
    { label: "Puntos", value: `${points}/${max}`, Icon: Goal }
  ];

  return (
    <div className="glass-panel rounded-lg p-5 shadow-stadium sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase text-mundialGold">Estadísticas personales</p>
        <h2 className="mt-1 text-2xl font-black uppercase text-white">{calculateRank(percentage)}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-lg bg-white/10 p-4">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-mundialGold">
              <Icon size={19} />
            </div>
            <p className="text-xs font-black uppercase text-white/62">{label}</p>
            <p className="mt-1 text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-midnight/36 p-4">
          <p className="text-xs font-black uppercase text-mundialGold">Dificultad</p>
          <p className="mt-1 text-lg font-black text-white">{difficultyLabels[difficulty]}</p>
        </div>
        <div className="rounded-lg bg-midnight/36 p-4">
          <p className="text-xs font-black uppercase text-mundialGold">Selección con más aciertos</p>
          <p className="mt-1 text-lg font-black text-white">{bestTeam}</p>
        </div>
        <div className="rounded-lg bg-midnight/36 p-4">
          <p className="text-xs font-black uppercase text-mundialGold">Selección con más fallos</p>
          <p className="mt-1 text-lg font-black text-white">{worstTeam}</p>
        </div>
      </div>
    </div>
  );
}
