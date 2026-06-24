import { AnimatePresence, motion } from "framer-motion";
import { BellOff, BellRing, ChevronLeft, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import FinalResult from "./components/FinalResult";
import GroupStandings from "./components/GroupStandings";
import MatchCard from "./components/MatchCard";
import ModeSelector from "./components/ModeSelector";
import PlayerStats from "./components/PlayerStats";
import ProgressBar from "./components/ProgressBar";
import ScoreBoard from "./components/ScoreBoard";
import ThemeToggle from "./components/ThemeToggle";
import TrophyAnimation from "./components/TrophyAnimation";
import TriondaBall from "./components/TriondaBall";
import AnswerReview from "./components/AnswerReview";
import matchesData from "./data/matches2026.json";
import type { Difficulty } from "./types/Difficulty";
import { difficultyLabels } from "./types/Difficulty";
import type { Match } from "./types/Match";
import type { ReviewedAnswer, UserAnswer } from "./types/UserAnswer";
import { calculateRank } from "./utils/calculateRank";
import {
  clearProgress,
  loadBestScore,
  loadProgress,
  saveBestScore,
  saveProgress,
  type BestScore,
  type GameMode
} from "./utils/localStorage";
import { getMaxScore } from "./utils/scoring";
import { sortMatches } from "./utils/sortMatches";
import { validateMatchAnswer } from "./utils/matchValidator";

type Screen = "home" | "mode" | "game" | "review" | "final" | "answers" | "stats" | "standings";

const rawMatches = matchesData as Match[];

function playWhistle(enabled: boolean, success = true) {
  if (!enabled) return;
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = success ? "triangle" : "square";
  oscillator.frequency.value = success ? 720 : 180;
  gain.gain.value = 0.045;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
}

function getTeams(matches: Match[]) {
  return Array.from(new Set(matches.flatMap((match) => [match.equipoLocal, match.equipoVisitante]))).sort((a, b) => a.localeCompare(b));
}

export default function App() {
  const matches = useMemo(() => sortMatches(rawMatches), []);
  const teams = useMemo(() => getTeams(matches), [matches]);
  const [screen, setScreen] = useState<Screen>("home");
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [mode, setMode] = useState<GameMode>("all");
  const [selectedTeam, setSelectedTeam] = useState(teams[0] ?? "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<ReviewedAnswer[]>([]);
  const [lastReview, setLastReview] = useState<ReviewedAnswer | null>(null);
  const [toleranceMinutes, setToleranceMinutes] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [bestScore, setBestScore] = useState<BestScore | null>(() => loadBestScore());
  const [hasSavedGame, setHasSavedGame] = useState(() => Boolean(loadProgress()));

  const filteredMatches = useMemo(() => {
    if (mode === "groups") return matches.filter((match) => match.fase === "Fase de grupos");
    if (mode === "team" && selectedTeam) {
      return matches.filter((match) => match.equipoLocal === selectedTeam || match.equipoVisitante === selectedTeam);
    }
    return matches;
  }, [matches, mode, selectedTeam]);

  const currentMatch = filteredMatches[currentIndex];
  const currentScore = reviews.reduce((total, review) => total + review.score, 0);
  const maxScore = getMaxScore(difficulty, filteredMatches.length);

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", themeMode === "light");
  }, [themeMode]);

  useEffect(() => {
    if (screen === "game" || screen === "review") {
      saveProgress({
        difficulty,
        mode,
        selectedTeam,
        currentIndex,
        reviews,
        toleranceMinutes,
        soundEnabled,
        themeMode
      });
      setHasSavedGame(true);
    }
  }, [currentIndex, difficulty, mode, reviews, screen, selectedTeam, soundEnabled, themeMode, toleranceMinutes]);

  function startNewGame() {
    clearProgress();
    setReviews([]);
    setLastReview(null);
    setCurrentIndex(0);
    setScreen("game");
    setHasSavedGame(false);
  }

  function continueGame() {
    const saved = loadProgress();
    if (!saved) return;
    setDifficulty(saved.difficulty);
    setMode(saved.mode);
    setSelectedTeam(saved.selectedTeam || selectedTeam);
    setCurrentIndex(saved.currentIndex);
    setReviews(saved.reviews);
    setToleranceMinutes(saved.toleranceMinutes);
    setSoundEnabled(saved.soundEnabled);
    setThemeMode(saved.themeMode);
    setLastReview(saved.reviews[saved.reviews.length - 1] ?? null);
    setScreen("game");
  }

  function resetProgress() {
    clearProgress();
    setReviews([]);
    setLastReview(null);
    setCurrentIndex(0);
    setHasSavedGame(false);
  }

  function finishGame(finalReviews = reviews) {
    const finalScore = finalReviews.reduce((total, review) => total + review.score, 0);
    const finalMax = finalReviews.reduce((total, review) => total + review.maxScore, 0);
    const percentage = finalMax > 0 ? (finalScore / finalMax) * 100 : 0;
    const newBest: BestScore = {
      score: finalScore,
      maxScore: finalMax,
      percentage,
      difficulty,
      playedAt: new Date().toISOString()
    };

    if (!bestScore || percentage > bestScore.percentage || (percentage === bestScore.percentage && finalScore > bestScore.score)) {
      saveBestScore(newBest);
      setBestScore(newBest);
    }
    clearProgress();
    setHasSavedGame(false);
    setScreen("final");
  }

  function handleSubmit(answer: UserAnswer) {
    if (!currentMatch) return;
    const review = validateMatchAnswer(currentMatch, answer, difficulty, toleranceMinutes);
    const nextReviews = [...reviews, review];
    setReviews(nextReviews);
    setLastReview(review);
    playWhistle(soundEnabled, review.score === review.maxScore);
    setScreen("review");
  }

  function nextMatch() {
    if (currentIndex + 1 >= filteredMatches.length) {
      finishGame(reviews);
      return;
    }
    setCurrentIndex((index) => index + 1);
    setScreen("game");
  }

  function backToFinal() {
    setScreen("final");
  }

  function finalScore() {
    return reviews.reduce((total, review) => total + review.score, 0);
  }

  const rootClass = `min-h-screen stadium-bg text-white ${themeMode === "light" ? "light-mode" : ""}`;

  return (
    <div className={rootClass}>
      <div className="relative z-10 mx-auto min-h-screen w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setScreen("home")}
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Ir al inicio"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-midnight shadow-glow">
              <TrophyAnimation compact />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black uppercase text-mundialGold">Desafío Mundial</span>
              <span className="block truncate text-lg font-black uppercase text-white">FIFA 2026</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/12 text-white shadow-lg transition hover:bg-white/22"
              title={soundEnabled ? "Desactivar sonidos" : "Activar sonidos"}
              aria-label={soundEnabled ? "Desactivar sonidos" : "Activar sonidos"}
            >
              {soundEnabled ? <BellRing size={20} /> : <BellOff size={20} />}
            </button>
            <ThemeToggle themeMode={themeMode} onToggle={() => setThemeMode((value) => (value === "dark" ? "light" : "dark"))} />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.main
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex min-h-[78vh] flex-col items-center justify-center overflow-hidden text-center"
            >
              <div className="brand-orbit" />
              <div className="pointer-events-none absolute bottom-10 right-8 hidden opacity-90 lg:block">
                <TrophyAnimation compact />
              </div>

              <section className="relative z-10 flex w-full max-w-6xl flex-col items-center px-2 py-8">
                <div className="launch-pill">Launch Edition</div>

                <div className="brand-lockup mt-7">
                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <button
                      type="button"
                      onClick={() => setScreen("standings")}
                      className="rounded-full transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                      title="Ver tablas de grupos"
                      aria-label="Ver tablas de grupos"
                    >
                      <span className="block sm:hidden">
                        <TriondaBall size={82} />
                      </span>
                      <span className="hidden sm:block">
                        <TriondaBall size={116} />
                      </span>
                    </button>
                    <div>
                      <div className="brand-title">FIFA</div>
                      <div className="brand-subtitle">World Cup</div>
                    </div>
                  </div>
                  <h1 className="mt-5 text-2xl font-black uppercase leading-tight text-white sm:text-4xl">
                    Desafío Mundial FIFA 2026
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={() => setScreen("mode")}
                  className="brand-cta mt-6"
                >
                  Descubre ahora
                </button>

                <p className="mt-6 max-w-2xl text-base font-bold uppercase leading-relaxed text-white/78 sm:text-lg">
                  Adiviná resultados, goleadores y minutos del Mundial 2026
                </p>

                <div className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/24 bg-white px-4 py-2 text-xs font-black uppercase text-black">
                  <span className="h-2 w-2 rounded-full bg-mundialGreen" />
                  {matches.length} partidos jugables cargados
                </div>

                <div className="mt-8 w-full max-w-5xl">
                  <DifficultySelector value={difficulty} onChange={setDifficulty} />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setScreen("mode")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-4 text-sm font-black uppercase text-black shadow-glow transition hover:bg-mundialGold"
                  >
                    <Play size={20} />
                    Jugar ahora
                  </button>
                  <button
                    type="button"
                    onClick={continueGame}
                    disabled={!hasSavedGame}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-black px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Continuar partida
                  </button>
                </div>
              </section>
            </motion.main>
          )}

          {screen === "mode" && (
            <motion.main key="mode" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <ModeSelector
                mode={mode}
                selectedTeam={selectedTeam}
                teams={teams}
                hasSavedGame={hasSavedGame}
                availableCount={filteredMatches.length}
                onModeChange={setMode}
                onTeamChange={setSelectedTeam}
                onStart={startNewGame}
                onContinue={continueGame}
                onResetProgress={resetProgress}
              />
            </motion.main>
          )}

          {screen === "standings" && (
            <motion.main key="standings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <GroupStandings matches={rawMatches} onBack={() => setScreen("home")} />
            </motion.main>
          )}

          {screen === "game" && currentMatch && (
            <motion.main key={`game-${currentMatch.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="glass-panel rounded-lg p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-mundialGold">{difficultyLabels[difficulty]}</p>
                      <h2 className="text-xl font-black uppercase text-white">Partido {currentIndex + 1} de {filteredMatches.length}</h2>
                    </div>
                    <p className="text-sm font-bold text-white/72">Rango proyectado: {calculateRank(maxScore ? (currentScore / maxScore) * 100 : 0)}</p>
                  </div>
                  <ProgressBar value={currentIndex} total={filteredMatches.length} label="Partidos completados" />
                </div>
                <ScoreBoard
                  current={currentIndex + 1}
                  total={filteredMatches.length}
                  score={currentScore}
                  maxScore={maxScore}
                  bestScore={bestScore}
                />
              </div>
              <MatchCard
                match={currentMatch}
                difficulty={difficulty}
                toleranceMinutes={toleranceMinutes}
                onToleranceChange={setToleranceMinutes}
                onSubmit={handleSubmit}
              />
            </motion.main>
          )}

          {screen === "review" && currentMatch && lastReview && (
            <motion.main key="review" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <AnswerReview match={currentMatch} review={lastReview} isLast={currentIndex + 1 >= filteredMatches.length} onNext={nextMatch} />
            </motion.main>
          )}

          {screen === "final" && (
            <motion.main key="final" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <FinalResult
                score={finalScore()}
                maxScore={reviews.reduce((total, review) => total + review.maxScore, 0)}
                difficulty={difficulty}
                bestScore={bestScore}
                onRestart={startNewGame}
                onChangeDifficulty={() => setScreen("home")}
                onShowAnswers={() => setScreen("answers")}
                onShowStats={() => setScreen("stats")}
              />
            </motion.main>
          )}

          {screen === "answers" && (
            <motion.main key="answers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-5xl">
              <button type="button" onClick={backToFinal} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black uppercase text-white">
                <ChevronLeft size={18} />
                Volver
              </button>
              <div className="glass-panel rounded-lg p-5 shadow-stadium sm:p-6">
                <p className="text-xs font-black uppercase text-mundialGold">Respuestas correctas</p>
                <h2 className="mt-1 text-3xl font-black uppercase text-white">Todos los partidos jugados</h2>
                <div className="mt-5 grid gap-3">
                  {filteredMatches.map((match) => (
                    <div key={match.id} className="rounded-lg border border-white/14 bg-white/10 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-black text-white">{match.banderaLocal} {match.equipoLocal} {match.resultadoLocal} - {match.resultadoVisitante} {match.equipoVisitante} {match.banderaVisitante}</p>
                        <p className="text-xs font-bold uppercase text-white/62">{match.fecha} · {match.grupo}</p>
                      </div>
                      <p className="mt-2 text-sm text-white/72">
                        {match.goles.length ? match.goles.map((goal) => `${goal.jugador}${goal.ownGoal ? " (EC)" : ""} ${goal.minuto}’`).join(" · ") : "Sin goles"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.main>
          )}

          {screen === "stats" && (
            <motion.main key="stats" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-6xl">
              <button type="button" onClick={backToFinal} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black uppercase text-white">
                <ChevronLeft size={18} />
                Volver
              </button>
              <PlayerStats reviews={reviews} matches={filteredMatches} difficulty={difficulty} />
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
