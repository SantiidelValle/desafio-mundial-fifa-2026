import { Medal, Target, Trophy } from "lucide-react";
import type { BestScore } from "../utils/localStorage";
import ProgressBar from "./ProgressBar";

interface ScoreBoardProps {
  current: number;
  total: number;
  score: number;
  maxScore: number;
  bestScore: BestScore | null;
}

export default function ScoreBoard({ current, total, score, maxScore, bestScore }: ScoreBoardProps) {
  const remaining = Math.max(0, total - current + 1);

  return (
    <aside className="glass-panel rounded-lg p-4 shadow-stadium">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <div className="rounded-lg bg-white/10 p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-mundialGold">
            <Target size={16} />
            Partido
          </div>
          <div className="mt-2 text-3xl font-black text-white">
            {current}<span className="text-white/45">/{total}</span>
          </div>
          <p className="text-xs text-white/66">{remaining} por jugar contando este.</p>
        </div>

        <div className="rounded-lg bg-white/10 p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-mundialGold">
            <Trophy size={16} />
            Puntaje
          </div>
          <div className="mt-2 text-3xl font-black text-white">
            {score}<span className="text-white/45">/{maxScore}</span>
          </div>
          <p className="text-xs text-white/66">Se actualiza después de cada corrección.</p>
        </div>

        <div className="rounded-lg bg-white/10 p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-mundialGold">
            <Medal size={16} />
            Mejor marca
          </div>
          <div className="mt-2 text-3xl font-black text-white">
            {bestScore ? bestScore.score : 0}
            <span className="text-white/45">/{bestScore ? bestScore.maxScore : maxScore}</span>
          </div>
          <p className="text-xs text-white/66">{bestScore ? `${Math.round(bestScore.percentage)}% histórico local` : "Todavía sin ranking local."}</p>
        </div>
      </div>
      <div className="mt-4">
        <ProgressBar value={Math.max(0, current - 1)} total={total} label="Avance de la partida" />
      </div>
    </aside>
  );
}
