import { BarChart3, Eye, Medal, Share2, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import type { Difficulty } from "../types/Difficulty";
import { difficultyLabels } from "../types/Difficulty";
import type { BestScore } from "../utils/localStorage";
import { calculateRank } from "../utils/calculateRank";
import RestartButton from "./RestartButton";
import TrophyAnimation from "./TrophyAnimation";

interface FinalResultProps {
  score: number;
  maxScore: number;
  difficulty: Difficulty;
  bestScore: BestScore | null;
  onRestart: () => void;
  onChangeDifficulty: () => void;
  onShowAnswers: () => void;
  onShowStats: () => void;
}

export default function FinalResult({
  score,
  maxScore,
  difficulty,
  bestScore,
  onRestart,
  onChangeDifficulty,
  onShowAnswers,
  onShowStats
}: FinalResultProps) {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const rank = calculateRank(percentage);
  const highScore = percentage >= 75;

  async function shareResult() {
    const text = `Desafío Mundial FIFA 2026: hice ${score}/${maxScore} (${percentage}%) en modo ${difficultyLabels[difficulty]}. Rango: ${rank}.`;
    if (navigator.share) {
      await navigator.share({ title: "Desafío Mundial FIFA 2026", text });
      return;
    }
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="glass-panel relative overflow-hidden rounded-lg p-5 text-center shadow-stadium sm:p-6">
        {highScore && (
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 18 }).map((_, index) => (
              <motion.span
                key={index}
                className="absolute h-2 w-2 rounded-full bg-mundialGold"
                style={{ left: `${(index * 23) % 100}%`, top: `${(index * 17) % 80}%` }}
                animate={{ y: [0, 160], opacity: [1, 0], rotate: [0, 180] }}
                transition={{ duration: 2.4 + (index % 5) * 0.25, repeat: Infinity, delay: index * 0.08 }}
              />
            ))}
          </div>
        )}
        <div className="relative z-10 mx-auto flex justify-center">
          <TrophyAnimation compact={false} />
        </div>
        <p className="relative z-10 mt-4 text-xs font-black uppercase text-mundialGold">{highScore ? "Celebración desbloqueada" : "A revisar los resúmenes"}</p>
        <h2 className="relative z-10 mt-1 text-3xl font-black uppercase text-white">{rank}</h2>
      </div>

      <div className="glass-panel rounded-lg p-5 shadow-stadium sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-black uppercase text-mundialGold">Resultado final</p>
          <h1 className="mt-1 text-3xl font-black uppercase text-white sm:text-5xl">Puntaje final</h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-xs font-black uppercase text-white/62">Puntos</p>
            <p className="mt-2 text-4xl font-black text-white">{score}<span className="text-white/42">/{maxScore}</span></p>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-xs font-black uppercase text-white/62">Acierto</p>
            <p className="mt-2 text-4xl font-black text-white">{percentage}%</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-xs font-black uppercase text-white/62">Modo</p>
            <p className="mt-2 text-2xl font-black text-white">{difficultyLabels[difficulty]}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-white/16 bg-midnight/34 p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-mundialGold text-midnight">
              <Medal size={22} />
            </span>
            <div>
              <p className="text-xs font-black uppercase text-mundialGold">Ranking local</p>
              <p className="font-bold text-white/78">
                {bestScore ? `Mejor marca: ${bestScore.score}/${bestScore.maxScore} (${Math.round(bestScore.percentage)}%).` : "Esta fue tu primera marca guardada."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <RestartButton onRestart={onRestart} label="Reiniciar" />
          <button
            type="button"
            onClick={onChangeDifficulty}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/12 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-white/22"
          >
            <Trophy size={18} />
            Cambiar dificultad
          </button>
          <button
            type="button"
            onClick={onShowAnswers}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/12 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-white/22"
          >
            <Eye size={18} />
            Ver respuestas
          </button>
          <button
            type="button"
            onClick={onShowStats}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/12 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-white/22"
          >
            <BarChart3 size={18} />
            Estadísticas
          </button>
          <button
            type="button"
            onClick={shareResult}
            className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-mundialGold px-5 py-3 text-sm font-black uppercase text-midnight shadow-glow transition hover:brightness-110"
          >
            <Share2 size={18} />
            Compartir resultado
          </button>
        </div>
      </div>
    </div>
  );
}
