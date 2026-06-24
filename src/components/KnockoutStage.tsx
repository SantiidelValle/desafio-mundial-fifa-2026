import type { Match } from "../types/Match";
import { getFlagImageUrl } from "../utils/flagImages";
import trophyImage from "../assets/world-cup-trophy.jpg";

interface KnockoutStageProps {
  matches: Match[];
}

interface KnockoutSlot {
  placeholder: string;
  team?: string;
}

interface RoundOf32Match {
  id: number;
  date: string;
  stadium: string;
  next: string;
  block: string;
  slots: [KnockoutSlot, KnockoutSlot];
}

interface StandingSeed {
  team: string;
  group: string;
  points: number;
  played: number;
  goalsFor: number;
  goalsAgainst: number;
}

const confirmedTeams = new Set(["México", "Alemania", "Estados Unidos", "Argentina"]);

const roundOf32Matches: RoundOf32Match[] = [
  {
    id: 73,
    date: "28 JUN",
    stadium: "Los Angeles Stadium",
    next: "M90",
    block: "Bloque 1",
    slots: [{ placeholder: "2A" }, { placeholder: "2B" }]
  },
  {
    id: 74,
    date: "29 JUN",
    stadium: "Boston Stadium",
    next: "M89",
    block: "Bloque 1",
    slots: [{ placeholder: "1E", team: "Alemania" }, { placeholder: "3ABCDF" }]
  },
  {
    id: 75,
    date: "29 JUN",
    stadium: "Monterrey Stadium",
    next: "M90",
    block: "Bloque 1",
    slots: [{ placeholder: "1F" }, { placeholder: "2C" }]
  },
  {
    id: 76,
    date: "29 JUN",
    stadium: "Houston Stadium",
    next: "M91",
    block: "Bloque 2",
    slots: [{ placeholder: "1C" }, { placeholder: "2F" }]
  },
  {
    id: 77,
    date: "30 JUN",
    stadium: "New York New Jersey Stadium",
    next: "M89",
    block: "Bloque 1",
    slots: [{ placeholder: "1I" }, { placeholder: "3CDFGH" }]
  },
  {
    id: 78,
    date: "30 JUN",
    stadium: "Dallas Stadium",
    next: "M91",
    block: "Bloque 2",
    slots: [{ placeholder: "2E" }, { placeholder: "2I" }]
  },
  {
    id: 79,
    date: "30 JUN",
    stadium: "Mexico City Stadium",
    next: "M92",
    block: "Bloque 2",
    slots: [{ placeholder: "1A", team: "México" }, { placeholder: "3CEFHI" }]
  },
  {
    id: 80,
    date: "1 JUL",
    stadium: "Atlanta Stadium",
    next: "M92",
    block: "Bloque 2",
    slots: [{ placeholder: "1L" }, { placeholder: "3EHIJK" }]
  },
  {
    id: 81,
    date: "1 JUL",
    stadium: "San Francisco Bay Area Stadium",
    next: "M94",
    block: "Bloque 3",
    slots: [{ placeholder: "1D", team: "Estados Unidos" }, { placeholder: "3BEFIJ" }]
  },
  {
    id: 82,
    date: "1 JUL",
    stadium: "Seattle Stadium",
    next: "M94",
    block: "Bloque 3",
    slots: [{ placeholder: "1G" }, { placeholder: "3AEHIJ" }]
  },
  {
    id: 83,
    date: "2 JUL",
    stadium: "Toronto Stadium",
    next: "M93",
    block: "Bloque 3",
    slots: [{ placeholder: "2K" }, { placeholder: "2L" }]
  },
  {
    id: 84,
    date: "2 JUL",
    stadium: "Los Angeles Stadium",
    next: "M93",
    block: "Bloque 3",
    slots: [{ placeholder: "1H" }, { placeholder: "2J" }]
  },
  {
    id: 85,
    date: "2 JUL",
    stadium: "BC Place Vancouver",
    next: "M96",
    block: "Bloque 4",
    slots: [{ placeholder: "1B" }, { placeholder: "3EFGIJ" }]
  },
  {
    id: 86,
    date: "3 JUL",
    stadium: "Miami Stadium",
    next: "M95",
    block: "Bloque 4",
    slots: [{ placeholder: "1J", team: "Argentina" }, { placeholder: "2H" }]
  },
  {
    id: 87,
    date: "3 JUL",
    stadium: "Kansas City Stadium",
    next: "M96",
    block: "Bloque 4",
    slots: [{ placeholder: "1K" }, { placeholder: "3DEIJL" }]
  },
  {
    id: 88,
    date: "3 JUL",
    stadium: "Dallas Stadium",
    next: "M95",
    block: "Bloque 4",
    slots: [{ placeholder: "2D" }, { placeholder: "2G" }]
  }
];

const pathBlocks = [
  { name: "Bloque 1", roundOf32: "M73/M74/M75/M77", roundOf16: "M89 y M90", quarterFinal: "M97" },
  { name: "Bloque 2", roundOf32: "M76/M78/M79/M80", roundOf16: "M91 y M92", quarterFinal: "M99" },
  { name: "Bloque 3", roundOf32: "M81/M82/M83/M84", roundOf16: "M93 y M94", quarterFinal: "M98" },
  { name: "Bloque 4", roundOf32: "M85/M86/M87/M88", roundOf16: "M95 y M96", quarterFinal: "M100" }
];

function groupSortValue(group: string) {
  const letter = group.match(/[A-Z]$/)?.[0] ?? group;
  return letter.charCodeAt(0);
}

function createStandingSeed(team: string, group: string): StandingSeed {
  return {
    team,
    group,
    points: 0,
    played: 0,
    goalsFor: 0,
    goalsAgainst: 0
  };
}

function addResult(seed: StandingSeed, goalsFor: number, goalsAgainst: number) {
  seed.played += 1;
  seed.goalsFor += goalsFor;
  seed.goalsAgainst += goalsAgainst;

  if (goalsFor > goalsAgainst) {
    seed.points += 3;
  } else if (goalsFor === goalsAgainst) {
    seed.points += 1;
  }
}

function buildStandings(matches: Match[]) {
  const groups = new Map<string, Map<string, StandingSeed>>();

  for (const match of matches.filter((item) => item.fase === "Fase de grupos")) {
    if (!groups.has(match.grupo)) groups.set(match.grupo, new Map());
    const group = groups.get(match.grupo)!;

    if (!group.has(match.equipoLocal)) group.set(match.equipoLocal, createStandingSeed(match.equipoLocal, match.grupo));
    if (!group.has(match.equipoVisitante)) group.set(match.equipoVisitante, createStandingSeed(match.equipoVisitante, match.grupo));

    if (typeof match.resultadoLocal !== "number" || typeof match.resultadoVisitante !== "number") continue;

    addResult(group.get(match.equipoLocal)!, match.resultadoLocal, match.resultadoVisitante);
    addResult(group.get(match.equipoVisitante)!, match.resultadoVisitante, match.resultadoLocal);
  }

  return Array.from(groups.values()).map((group) =>
    Array.from(group.values()).sort((a, b) => {
      const differenceA = a.goalsFor - a.goalsAgainst;
      const differenceB = b.goalsFor - b.goalsAgainst;
      if (b.points !== a.points) return b.points - a.points;
      if (differenceB !== differenceA) return differenceB - differenceA;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.localeCompare(b.team);
    })
  );
}

function buildPendingQualified(matches: Match[]) {
  return buildStandings(matches)
    .flatMap((group) =>
      group.filter((team) => {
        if (confirmedTeams.has(team.team)) return false;
        const teamsThatCanCatch = group.filter((other) => other.team !== team.team && other.points + (3 - other.played) * 3 >= team.points);
        return teamsThatCanCatch.length <= 1;
      })
    )
    .sort((a, b) => groupSortValue(a.group) - groupSortValue(b.group) || b.points - a.points);
}

function describePlaceholder(placeholder: string) {
  const position = placeholder[0];
  const groups = placeholder.slice(1).split("").join("/");

  if (position === "1") return `1° Grupo ${groups}`;
  if (position === "2") return `2° Grupo ${groups}`;
  if (position === "3") return `3° de ${groups}`;
  return placeholder;
}

function SlotRow({ slot }: { slot: KnockoutSlot }) {
  const flagImage = slot.team ? getFlagImageUrl(slot.team) : null;

  return (
    <div className="grid h-11 grid-cols-[3.25rem_minmax(0,1fr)] items-stretch overflow-hidden rounded-l-[0.28rem] rounded-r-[0.8rem] bg-white text-black shadow-[0_1px_0_rgba(255,255,255,0.55),inset_0_0_0_1px_rgba(0,0,0,0.08)]">
      <div className="h-full overflow-hidden bg-black/5">
        <div className="flag-wedge h-full w-full overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]">
          {flagImage ? (
            <img src={flagImage} alt={`Bandera de ${slot.team}`} className="h-full w-full object-cover" draggable={false} />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-black text-xs font-black text-white">{slot.placeholder[0]}</span>
          )}
        </div>
      </div>

      <div className="flex min-w-0 items-center px-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase leading-tight sm:text-sm">{slot.team ?? describePlaceholder(slot.placeholder)}</p>
          <p className="truncate text-[9px] font-black uppercase text-black/45">{slot.team ? slot.placeholder : "Slot FIFA"}</p>
        </div>
      </div>
    </div>
  );
}

function BracketMatch({ match }: { match: RoundOf32Match }) {
  return (
    <article className="relative rounded-lg border border-white/14 bg-white/10 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <span className="rounded-md bg-mundialGold px-2 py-1 text-[10px] font-black uppercase text-black">M{match.id}</span>
        <span className="text-[10px] font-black uppercase text-white/64">{match.date}</span>
      </div>

      <div className="grid gap-1.5">
        {match.slots.map((slot) => (
          <SlotRow key={slot.placeholder} slot={slot} />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[9px] font-black uppercase text-white/52">
        <span className="truncate">{match.stadium}</span>
        <span>{match.next}</span>
      </div>
    </article>
  );
}

function QualifiedChip({ team, label }: { team: string; label: string }) {
  const flagImage = getFlagImageUrl(team);

  return (
    <div className="grid h-10 grid-cols-[3rem_minmax(0,1fr)] items-stretch overflow-hidden rounded-l-[0.28rem] rounded-r-[0.8rem] bg-white text-black">
      <div className="h-full overflow-hidden">
        {flagImage ? <img src={flagImage} alt={`Bandera de ${team}`} className="h-full w-full object-cover" draggable={false} /> : null}
      </div>
      <div className="flex min-w-0 items-center px-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase">{team}</p>
          <p className="truncate text-[9px] font-black uppercase text-black/45">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function KnockoutStage({ matches }: KnockoutStageProps) {
  const leftMatches = roundOf32Matches.slice(0, 8);
  const rightMatches = roundOf32Matches.slice(8);
  const pendingQualified = buildPendingQualified(matches);
  const confirmedCount = Array.from(confirmedTeams).length;

  return (
    <div className="relative z-10">
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
          <p className="text-xs font-black uppercase text-white/60">Casilleros FIFA</p>
          <p className="text-3xl font-black text-white">{confirmedCount}</p>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
          <p className="text-xs font-black uppercase text-white/60">Round of 32</p>
          <p className="text-3xl font-black text-white">16</p>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
          <p className="text-xs font-black uppercase text-white/60">Formato</p>
          <p className="text-lg font-black uppercase leading-tight text-white">Top 2 + 8 terceros</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_16rem_minmax(0,1fr)]">
        <div className="grid gap-3">
          {leftMatches.map((match) => (
            <BracketMatch key={match.id} match={match} />
          ))}
        </div>

        <div className="order-first flex flex-col justify-between rounded-lg border border-white/14 bg-black/36 p-4 text-center xl:order-none">
          <div>
            <p className="text-xs font-black uppercase text-mundialGold">Copa Mundial 2026</p>
            <h3 className="mt-1 text-2xl font-black uppercase leading-none text-white">Knockout stage</h3>
          </div>

          <div className="mx-auto my-5 h-44 w-32 overflow-hidden rounded-lg border border-white/12 bg-black shadow-glow">
            <img src={trophyImage} alt="Trofeo de la Copa Mundial" className="h-full w-full object-cover" draggable={false} />
          </div>

          <div className="grid gap-2">
            {Array.from(confirmedTeams).map((team) => (
              <QualifiedChip key={team} team={team} label="Casillero confirmado" />
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {rightMatches.map((match) => (
            <BracketMatch key={match.id} match={match} />
          ))}
        </div>
      </div>

      {pendingQualified.length > 0 && (
        <div className="mt-5 rounded-lg border border-white/14 bg-white/10 p-3">
          <p className="mb-3 text-xs font-black uppercase text-mundialGold">Clasificados con cruce por definir</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {pendingQualified.map((team) => (
              <QualifiedChip key={team.team} team={team.team} label={team.group} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {pathBlocks.map((block) => (
          <article key={block.name} className="rounded-lg border border-white/14 bg-black/30 p-3">
            <p className="text-xs font-black uppercase text-mundialGold">{block.name}</p>
            <p className="mt-2 text-sm font-black uppercase text-white">{block.roundOf32}</p>
            <p className="mt-1 text-[10px] font-black uppercase text-white/58">
              {block.roundOf16} · {block.quarterFinal}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
