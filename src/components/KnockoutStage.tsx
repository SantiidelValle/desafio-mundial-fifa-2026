import type { Match } from "../types/Match";
import { getFlagImageUrl } from "../utils/flagImages";
import trophyImage from "../assets/world-cup-trophy-cutout.png";

interface KnockoutStageProps {
  matches: Match[];
}

interface KnockoutSlot {
  code: string;
  team?: string;
}

interface BracketMatch {
  id: number;
  slots: [KnockoutSlot, KnockoutSlot];
}

interface TeamStanding {
  team: string;
  played: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

const roundOf32Matches: BracketMatch[] = [
  { id: 73, slots: [{ code: "2A" }, { code: "2B" }] },
  { id: 74, slots: [{ code: "1E" }, { code: "3ABCDF" }] },
  { id: 75, slots: [{ code: "1F" }, { code: "2C" }] },
  { id: 76, slots: [{ code: "1C" }, { code: "2F" }] },
  { id: 77, slots: [{ code: "1I" }, { code: "3CDFGH" }] },
  { id: 78, slots: [{ code: "2E" }, { code: "2I" }] },
  { id: 79, slots: [{ code: "1A", team: "México" }, { code: "3CEFHI" }] },
  { id: 80, slots: [{ code: "1L" }, { code: "3EHIJK" }] },
  { id: 81, slots: [{ code: "1D" }, { code: "3BEFIJ" }] },
  { id: 82, slots: [{ code: "1G" }, { code: "3AEHIJ" }] },
  { id: 83, slots: [{ code: "2K" }, { code: "2L" }] },
  { id: 84, slots: [{ code: "1H" }, { code: "2J" }] },
  { id: 85, slots: [{ code: "1B" }, { code: "3EFGIJ" }] },
  { id: 86, slots: [{ code: "1J" }, { code: "2H" }] },
  { id: 87, slots: [{ code: "1K" }, { code: "3DEIJL" }] },
  { id: 88, slots: [{ code: "2D" }, { code: "2G" }] }
];

const roundOf32ById = new Map(roundOf32Matches.map((match) => [match.id, match]));

function getRoundOf32Match(id: number) {
  const match = roundOf32ById.get(id);
  if (!match) throw new Error(`Missing match ${id}`);
  return match;
}

function winner(code: number): KnockoutSlot {
  return { code: `G${code}` };
}

const leftRoundOf32 = [74, 77, 73, 75, 83, 84, 81, 82].map(getRoundOf32Match);
const rightRoundOf32 = [76, 78, 79, 80, 86, 88, 85, 87].map(getRoundOf32Match);

const leftRoundOf16: BracketMatch[] = [
  { id: 89, slots: [winner(74), winner(77)] },
  { id: 90, slots: [winner(73), winner(75)] },
  { id: 93, slots: [winner(83), winner(84)] },
  { id: 94, slots: [winner(81), winner(82)] }
];

const rightRoundOf16: BracketMatch[] = [
  { id: 91, slots: [winner(76), winner(78)] },
  { id: 92, slots: [winner(79), winner(80)] },
  { id: 95, slots: [winner(86), winner(88)] },
  { id: 96, slots: [winner(85), winner(87)] }
];

const leftQuarterFinals: BracketMatch[] = [
  { id: 97, slots: [winner(89), winner(90)] },
  { id: 98, slots: [winner(93), winner(94)] }
];

const rightQuarterFinals: BracketMatch[] = [
  { id: 99, slots: [winner(91), winner(92)] },
  { id: 100, slots: [winner(95), winner(96)] }
];

const leftSemiFinal: BracketMatch[] = [{ id: 101, slots: [winner(97), winner(98)] }];
const rightSemiFinal: BracketMatch[] = [{ id: 102, slots: [winner(99), winner(100)] }];
const finalMatch: BracketMatch = { id: 104, slots: [winner(101), winner(102)] };

function groupLetter(group: string) {
  return group.match(/[A-Z]$/)?.[0] ?? group;
}

function createStanding(team: string): TeamStanding {
  return {
    team,
    played: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0
  };
}

function addResult(team: TeamStanding, goalsFor: number, goalsAgainst: number) {
  team.played += 1;
  team.goalsFor += goalsFor;
  team.goalsAgainst += goalsAgainst;
  team.goalDifference = team.goalsFor - team.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    team.points += 3;
  } else if (goalsFor === goalsAgainst) {
    team.points += 1;
  }
}

function buildQualifiedSlots(matches: Match[]) {
  const groups = new Map<string, Map<string, TeamStanding>>();

  for (const match of matches.filter((item) => item.fase === "Fase de grupos")) {
    if (!groups.has(match.grupo)) {
      groups.set(match.grupo, new Map());
    }

    const group = groups.get(match.grupo)!;
    if (!group.has(match.equipoLocal)) {
      group.set(match.equipoLocal, createStanding(match.equipoLocal));
    }
    if (!group.has(match.equipoVisitante)) {
      group.set(match.equipoVisitante, createStanding(match.equipoVisitante));
    }

    if (typeof match.resultadoLocal !== "number" || typeof match.resultadoVisitante !== "number") {
      continue;
    }

    addResult(group.get(match.equipoLocal)!, match.resultadoLocal, match.resultadoVisitante);
    addResult(group.get(match.equipoVisitante)!, match.resultadoVisitante, match.resultadoLocal);
  }

  const qualifiedSlots = new Map<string, string>();

  for (const [groupName, teams] of groups.entries()) {
    const standings = Array.from(teams.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.localeCompare(b.team);
    });
    const groupIsComplete = standings.length === 4 && standings.every((team) => team.played === 3);

    if (!groupIsComplete) {
      continue;
    }

    const letter = groupLetter(groupName);
    qualifiedSlots.set(`1${letter}`, standings[0].team);
    qualifiedSlots.set(`2${letter}`, standings[1].team);
  }

  return qualifiedSlots;
}

function resolveSlot(slot: KnockoutSlot, qualifiedSlots: Map<string, string>): KnockoutSlot {
  const team = qualifiedSlots.get(slot.code) ?? slot.team;
  return team ? { ...slot, team } : slot;
}

function SlotBox({ slot }: { slot: KnockoutSlot }) {
  const flagImage = slot.team ? getFlagImageUrl(slot.team) : null;

  return (
    <div
      className="flex h-8 w-full min-w-[3.9rem] max-w-[5.25rem] items-center justify-center overflow-hidden rounded-[0.25rem] border border-mundialGold/25 bg-midnight text-[10px] font-black uppercase text-white shadow-sm"
      title={slot.team ?? slot.code}
    >
      {flagImage ? <img src={flagImage} alt={`Bandera de ${slot.team}`} className="h-full w-full object-cover" draggable={false} /> : slot.code}
    </div>
  );
}

function MatchBox({ match, qualifiedSlots }: { match: BracketMatch; qualifiedSlots: Map<string, string> }) {
  return (
    <article className="flex flex-col items-center gap-1" aria-label={`Partido ${match.id}`}>
      {match.slots.map((slot) => {
        const resolvedSlot = resolveSlot(slot, qualifiedSlots);
        return <SlotBox key={`${match.id}-${slot.code}`} slot={resolvedSlot} />;
      })}
    </article>
  );
}

function BracketColumn({ label, matches, qualifiedSlots }: { label: string; matches: BracketMatch[]; qualifiedSlots: Map<string, string> }) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <p className="mb-2 text-center text-[10px] font-black uppercase text-mundialGold/70">{label}</p>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-around">
        {matches.map((match) => (
          <MatchBox key={match.id} match={match} qualifiedSlots={qualifiedSlots} />
        ))}
      </div>
    </div>
  );
}

function FinalColumn({ qualifiedSlots }: { qualifiedSlots: Map<string, string> }) {
  return (
    <div className="flex h-full min-w-0 flex-col items-center justify-center gap-5">
      <img
        src={trophyImage}
        alt="Trofeo de la Copa Mundial"
        className="h-48 w-auto object-contain drop-shadow-[0_18px_28px_rgba(245,188,66,0.32)]"
        draggable={false}
      />
      <div>
        <p className="mb-2 text-center text-[10px] font-black uppercase text-mundialGold">Final</p>
        <MatchBox match={finalMatch} qualifiedSlots={qualifiedSlots} />
      </div>
    </div>
  );
}

export default function KnockoutStage({ matches }: KnockoutStageProps) {
  const qualifiedSlots = buildQualifiedSlots(matches);

  return (
    <div className="relative z-10 overflow-hidden rounded-lg border border-mundialGold/15 bg-black px-2 py-4 shadow-[0_0_40px_rgba(0,0,0,0.36)] sm:px-4 sm:py-5">
      <div className="mb-5 text-center">
        <p className="text-xs font-black uppercase text-mundialGold">Copa Mundial 2026</p>
        <h3 className="mt-1 text-3xl font-black uppercase leading-none text-white sm:text-4xl">World Cup Bracket</h3>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid h-[clamp(36rem,58vw,46rem)] min-w-[960px] grid-cols-[minmax(4.8rem,1.08fr)_minmax(4.35rem,0.88fr)_minmax(4.35rem,0.72fr)_minmax(4.35rem,0.62fr)_minmax(10rem,1.55fr)_minmax(4.35rem,0.62fr)_minmax(4.35rem,0.72fr)_minmax(4.35rem,0.88fr)_minmax(4.8rem,1.08fr)] gap-4">
          <BracketColumn label="32" matches={leftRoundOf32} qualifiedSlots={qualifiedSlots} />
          <BracketColumn label="16" matches={leftRoundOf16} qualifiedSlots={qualifiedSlots} />
          <BracketColumn label="8" matches={leftQuarterFinals} qualifiedSlots={qualifiedSlots} />
          <BracketColumn label="4" matches={leftSemiFinal} qualifiedSlots={qualifiedSlots} />
          <FinalColumn qualifiedSlots={qualifiedSlots} />
          <BracketColumn label="4" matches={rightSemiFinal} qualifiedSlots={qualifiedSlots} />
          <BracketColumn label="8" matches={rightQuarterFinals} qualifiedSlots={qualifiedSlots} />
          <BracketColumn label="16" matches={rightRoundOf16} qualifiedSlots={qualifiedSlots} />
          <BracketColumn label="32" matches={rightRoundOf32} qualifiedSlots={qualifiedSlots} />
        </div>
      </div>
    </div>
  );
}
