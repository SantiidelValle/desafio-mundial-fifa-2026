import { ArrowRight, Check, X } from "lucide-react";
import type { Match } from "../types/Match";
import type { ReviewedAnswer } from "../types/UserAnswer";
import ResultFeedback from "./ResultFeedback";

interface AnswerReviewProps {
  match: Match;
  review: ReviewedAnswer;
  isLast: boolean;
  onNext: () => void;
}

function scoreLine(match: Match): string {
  return `${match.equipoLocal} ${match.resultadoLocal} - ${match.resultadoVisitante} ${match.equipoVisitante}`;
}

function userScoreLine(match: Match, review: ReviewedAnswer): string {
  return `${match.equipoLocal} ${review.answer.localGoals} - ${review.answer.awayGoals} ${match.equipoVisitante}`;
}

export default function AnswerReview({ match, review, isLast, onNext }: AnswerReviewProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <ResultFeedback review={review} />

      <div className="glass-panel rounded-lg p-5 shadow-stadium sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-mundialGold">{match.grupo} · {match.fase}</p>
            <h2 className="mt-1 text-2xl font-black uppercase text-white">{match.equipoLocal} vs {match.equipoVisitante}</h2>
          </div>
          <span className="rounded-full bg-white/12 px-3 py-2 text-xs font-black uppercase text-white/78">
            {match.fecha} · {match.hora}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-white/16 bg-white/10 p-4">
            <p className="text-xs font-black uppercase text-mundialGold">Resultado correcto</p>
            <p className="mt-2 text-xl font-black text-white">{scoreLine(match)}</p>
          </div>
          <div className="rounded-lg border border-white/16 bg-white/10 p-4">
            <p className="text-xs font-black uppercase text-mundialGold">Tu respuesta</p>
            <p className="mt-2 text-xl font-black text-white">{userScoreLine(match, review)}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["Resultado exacto", review.breakdown.result],
            ["Goleadores", review.breakdown.scorers],
            ["Minutos", review.breakdown.minutes]
          ].map(([label, ok]) => (
            <div key={String(label)} className="flex items-center gap-3 rounded-lg bg-midnight/34 p-3">
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${ok ? "bg-mundialGreen" : "bg-mundialRed"}`}>
                {ok ? <Check size={17} /> : <X size={17} />}
              </span>
              <span className="text-sm font-black uppercase text-white">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-white/16 bg-white/10 p-4">
          <p className="mb-3 text-xs font-black uppercase text-mundialGold">Goles correctos</p>
          {match.goles.length === 0 ? (
            <p className="text-sm font-bold text-white/72">Partido sin goles.</p>
          ) : (
            <div className="grid gap-2">
              {match.goles.map((goal, index) => (
                <div key={`${goal.jugador}-${index}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white">
                  <span className="font-bold">{goal.jugador}{goal.ownGoal ? " (en contra)" : ""}</span>
                  <span className="text-white/70">{goal.equipo} · {goal.minuto}’</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mundialGold px-6 py-4 text-sm font-black uppercase text-midnight shadow-glow transition hover:brightness-110"
        >
          {isLast ? "Ver resultado final" : "Siguiente partido"}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
