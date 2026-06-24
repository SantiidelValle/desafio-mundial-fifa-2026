import { motion } from "framer-motion";
import { Minus, Plus, Send, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Difficulty } from "../types/Difficulty";
import type { Match } from "../types/Match";
import type { GoalGuess, UserAnswer } from "../types/UserAnswer";
import FlagDisplay from "./FlagDisplay";

interface MatchCardProps {
  match: Match;
  difficulty: Difficulty;
  toleranceMinutes: boolean;
  onToleranceChange: (value: boolean) => void;
  onSubmit: (answer: UserAnswer) => void;
}

const emptyGoal = (team: string): GoalGuess => ({
  equipo: team,
  jugador: "",
  minuto: ""
});

export default function MatchCard({ match, difficulty, toleranceMinutes, onToleranceChange, onSubmit }: MatchCardProps) {
  const [localGoals, setLocalGoals] = useState("");
  const [awayGoals, setAwayGoals] = useState("");
  const [goals, setGoals] = useState<GoalGuess[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalGoals("");
    setAwayGoals("");
    setGoals([]);
    setError("");
  }, [match.id]);

  const teams = useMemo(() => [match.equipoLocal, match.equipoVisitante], [match.equipoLocal, match.equipoVisitante]);
  const showGoals = difficulty !== "standard";
  const showMinutes = difficulty === "impossible";

  function updateGoal(index: number, patch: Partial<GoalGuess>) {
    setGoals((current) => current.map((goal, goalIndex) => (goalIndex === index ? { ...goal, ...patch } : goal)));
  }

  function removeGoal(index: number) {
    setGoals((current) => current.filter((_, goalIndex) => goalIndex !== index));
  }

  function submit() {
    const parsedLocal = Number(localGoals);
    const parsedAway = Number(awayGoals);

    if (!Number.isInteger(parsedLocal) || !Number.isInteger(parsedAway) || parsedLocal < 0 || parsedAway < 0) {
      setError("Ingresá un marcador válido para los dos equipos.");
      return;
    }

    const filledGoals = goals.filter((goal) => goal.jugador.trim());
    if (showGoals && filledGoals.length !== parsedLocal + parsedAway) {
      setError("La cantidad de goleadores debe coincidir con el total de goles que escribiste.");
      return;
    }

    if (showMinutes && filledGoals.some((goal) => String(goal.minuto ?? "").trim() === "")) {
      setError("En modo imposible cada gol necesita minuto.");
      return;
    }

    onSubmit({
      matchId: match.id,
      localGoals: parsedLocal,
      awayGoals: parsedAway,
      goals: filledGoals
    });
  }

  return (
    <motion.section
      key={match.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="glass-panel overflow-hidden rounded-lg shadow-stadium"
    >
      <div className="relative border-b border-white/16 bg-black p-5 sm:p-6">
        <div className="relative z-10 flex flex-wrap items-center gap-3 text-xs font-black uppercase text-white/78">
          <span className="rounded-md bg-white px-3 py-1 text-black">{match.fase}</span>
          <span>{match.grupo}</span>
          <span>{match.fecha}</span>
          <span>{match.hora}</span>
          {match.estadio && <span>{match.estadio}</span>}
        </div>

        <div className="relative z-10 mt-6 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <FlagDisplay flag={match.banderaLocal} name={match.equipoLocal} align="center" />
          <div className="mx-auto flex items-center gap-3">
            <input
              value={localGoals}
              onChange={(event) => setLocalGoals(event.target.value)}
              inputMode="numeric"
              className="number-input h-20 w-20 rounded-lg border border-white/25 bg-white text-center text-4xl font-black text-midnight outline-none focus:ring-4 focus:ring-mundialGold/60"
              aria-label={`Goles de ${match.equipoLocal}`}
              placeholder="0"
            />
            <span className="rounded-lg bg-white px-4 py-2 text-2xl font-black text-black shadow">VS</span>
            <input
              value={awayGoals}
              onChange={(event) => setAwayGoals(event.target.value)}
              inputMode="numeric"
              className="number-input h-20 w-20 rounded-lg border border-white/25 bg-white text-center text-4xl font-black text-midnight outline-none focus:ring-4 focus:ring-mundialGold/60"
              aria-label={`Goles de ${match.equipoVisitante}`}
              placeholder="0"
            />
          </div>
          <FlagDisplay flag={match.banderaVisitante} name={match.equipoVisitante} align="center" />
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {showGoals && (
          <div className="rounded-lg border border-white/16 bg-white/10 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-mundialGold">Goleadores</p>
                <p className="text-sm text-white/70">Podés repetir jugador si hizo más de un gol.</p>
              </div>
              <button
                type="button"
                onClick={() => setGoals((current) => [...current, emptyGoal(match.equipoLocal)])}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black uppercase text-midnight transition hover:bg-mundialGold"
              >
                <Plus size={18} />
                Agregar gol
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/24 p-4 text-center text-sm font-bold text-white/66">
                Agregá un gol por cada tanto que escribas en el marcador.
              </div>
            ) : (
              <div className="grid gap-3">
                {goals.map((goal, index) => (
                  <div key={index} className="grid gap-3 rounded-lg bg-midnight/36 p-3 md:grid-cols-[160px_1fr_130px_auto]">
                    <select
                      value={goal.equipo}
                      onChange={(event) => updateGoal(index, { equipo: event.target.value })}
                      className="rounded-lg border border-white/20 bg-white px-3 py-3 font-bold text-midnight outline-none"
                      aria-label="Equipo del gol"
                    >
                      {teams.map((team) => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                    <input
                      value={goal.jugador}
                      onChange={(event) => updateGoal(index, { jugador: event.target.value })}
                      className="rounded-lg border border-white/20 bg-white px-3 py-3 font-bold text-midnight outline-none"
                      placeholder="Jugador"
                      aria-label="Nombre del goleador"
                    />
                    {showMinutes ? (
                      <input
                        value={goal.minuto}
                        onChange={(event) => updateGoal(index, { minuto: event.target.value })}
                        className="rounded-lg border border-white/20 bg-white px-3 py-3 font-bold text-midnight outline-none"
                        placeholder="23 o 45+2"
                        aria-label="Minuto del gol"
                      />
                    ) : (
                      <div className="hidden md:block" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-mundialRed"
                      aria-label="Quitar gol"
                      title="Quitar gol"
                    >
                      <Minus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showMinutes && (
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg bg-white/10 p-3 text-sm font-bold text-white/78">
                <input
                  type="checkbox"
                  checked={toleranceMinutes}
                  onChange={(event) => onToleranceChange(event.target.checked)}
                  className="h-5 w-5 accent-mundialGold"
                />
                <Timer size={18} />
                Permitir tolerancia de 1 minuto
              </label>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-mundialRed/50 bg-mundialRed/20 px-4 py-3 text-sm font-bold text-white">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={submit}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-sm font-black uppercase text-black shadow-glow transition hover:bg-mundialGold"
        >
          Corregir respuesta
          <Send size={19} />
        </button>
      </div>
    </motion.section>
  );
}
