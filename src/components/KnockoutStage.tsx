import type { Match } from "../types/Match";
import { getFlagImageUrl } from "../utils/flagImages";
import trophyImage from "../assets/world-cup-trophy-cutout.png";

interface KnockoutStageProps {
  matches: Match[];
}

interface TeamStanding {
  team: string;
  flag: string;
  played: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

interface SlotTeam {
  code: string;
  team?: string;
  flag?: string;
}

interface RoundOf32Tie {
  id: number;
  homeCode: string;
  awayCode: string;
}

const leftTies: RoundOf32Tie[] = [
  { id: 74, homeCode: "1E", awayCode: "3D" },
  { id: 77, homeCode: "1I", awayCode: "3F" },
  { id: 73, homeCode: "2A", awayCode: "2B" },
  { id: 75, homeCode: "1F", awayCode: "2C" },
  { id: 83, homeCode: "2K", awayCode: "2L" },
  { id: 84, homeCode: "1H", awayCode: "2J" },
  { id: 81, homeCode: "1D", awayCode: "3B" },
  { id: 82, homeCode: "1G", awayCode: "3I" }
];

const rightTies: RoundOf32Tie[] = [
  { id: 76, homeCode: "1C", awayCode: "2F" },
  { id: 78, homeCode: "2E", awayCode: "2I" },
  { id: 79, homeCode: "1A", awayCode: "3E" },
  { id: 80, homeCode: "1L", awayCode: "3K" },
  { id: 86, homeCode: "1J", awayCode: "2H" },
  { id: 88, homeCode: "2D", awayCode: "2G" },
  { id: 85, homeCode: "1B", awayCode: "3J" },
  { id: 87, homeCode: "1K", awayCode: "3L" }
];

const teamCodes: Record<string, string> = {
  alemania: "ALE",
  paraguay: "PAR",
  francia: "FRA",
  suecia: "SUE",
  sudafrica: "SUD",
  canada: "CAN",
  "paises bajos": "HOL",
  marruecos: "MAR",
  portugal: "POR",
  croacia: "CRO",
  espana: "ESP",
  austria: "AUT",
  "estados unidos": "USA",
  "bosnia y herzegovina": "BOS",
  belgica: "BEL",
  senegal: "SEN",
  brasil: "BRA",
  japon: "JAP",
  "costa de marfil": "COS",
  noruega: "NOR",
  mexico: "MEX",
  ecuador: "ECU",
  inglaterra: "ING",
  "rd congo": "RDC",
  argentina: "ARG",
  "cabo verde": "CAB",
  australia: "AUS",
  egipto: "EGI",
  suiza: "SUI",
  argelia: "ARG",
  colombia: "COL",
  ghana: "GHA"
};

function normalizeTeamName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function groupLetter(group: string) {
  return group.match(/[A-Z]$/)?.[0] ?? group;
}

function createStanding(team: string, flag: string): TeamStanding {
  return {
    team,
    flag,
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

function buildSlotTeams(matches: Match[]) {
  const groups = new Map<string, Map<string, TeamStanding>>();

  for (const match of matches.filter((item) => item.fase === "Fase de grupos")) {
    if (!groups.has(match.grupo)) {
      groups.set(match.grupo, new Map());
    }

    const group = groups.get(match.grupo)!;
    if (!group.has(match.equipoLocal)) {
      group.set(match.equipoLocal, createStanding(match.equipoLocal, match.banderaLocal));
    }
    if (!group.has(match.equipoVisitante)) {
      group.set(match.equipoVisitante, createStanding(match.equipoVisitante, match.banderaVisitante));
    }

    if (typeof match.resultadoLocal !== "number" || typeof match.resultadoVisitante !== "number") {
      continue;
    }

    addResult(group.get(match.equipoLocal)!, match.resultadoLocal, match.resultadoVisitante);
    addResult(group.get(match.equipoVisitante)!, match.resultadoVisitante, match.resultadoLocal);
  }

  const slotTeams = new Map<string, SlotTeam>();

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
    standings.slice(0, 3).forEach((team, index) => {
      slotTeams.set(`${index + 1}${letter}`, {
        code: `${index + 1}${letter}`,
        team: team.team,
        flag: team.flag
      });
    });
  }

  return slotTeams;
}

function resolveSlot(code: string, slotTeams: Map<string, SlotTeam>): SlotTeam {
  return slotTeams.get(code) ?? { code };
}

function displayCode(slot: SlotTeam) {
  if (!slot.team) return slot.code;
  return teamCodes[normalizeTeamName(slot.team)] ?? slot.team.slice(0, 3).toUpperCase();
}

function TeamFlag({ slot }: { slot: SlotTeam }) {
  const flagImage = slot.team ? getFlagImageUrl(slot.team) : null;

  return (
    <span className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[0.28rem] border border-white/25 bg-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]">
      {flagImage ? (
        <img src={flagImage} alt={`Bandera de ${slot.team}`} className="h-full w-full object-cover" draggable={false} />
      ) : (
        <span className="text-lg">{slot.flag ?? ""}</span>
      )}
    </span>
  );
}

function TeamSide({ slot, align = "left" }: { slot: SlotTeam; align?: "left" | "right" }) {
  const code = displayCode(slot);
  const name = slot.team ?? slot.code;

  if (align === "right") {
    return (
      <div className="flex min-w-0 items-center justify-end gap-2" title={name}>
        <span className="truncate text-right text-[clamp(1rem,1.7vw,1.45rem)] font-black uppercase leading-none text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.45)]">
          {code}
        </span>
        <TeamFlag slot={slot} />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2" title={name}>
      <TeamFlag slot={slot} />
      <span className="truncate text-[clamp(1rem,1.7vw,1.45rem)] font-black uppercase leading-none text-mundialGold drop-shadow-[0_2px_0_rgba(0,0,0,0.45)]">
        {code}
      </span>
    </div>
  );
}

function TieRow({ tie, slotTeams, side }: { tie: RoundOf32Tie; slotTeams: Map<string, SlotTeam>; side: "left" | "right" }) {
  const home = resolveSlot(tie.homeCode, slotTeams);
  const away = resolveSlot(tie.awayCode, slotTeams);

  return (
    <article className="relative grid h-[3.45rem] grid-cols-[minmax(0,1fr)_2.2rem_minmax(0,1fr)] items-center gap-2 rounded-[0.45rem] border border-mundialGold/30 bg-[#101414]/95 px-2 shadow-[0_12px_24px_rgba(0,0,0,0.26),inset_0_0_0_1px_rgba(255,255,255,0.04)]">
      <span
        aria-hidden="true"
        className={`absolute top-1/2 h-px w-6 bg-mundialGold/70 ${side === "left" ? "right-[-1.5rem]" : "left-[-1.5rem]"}`}
      />
      <TeamSide slot={home} />
      <span className="text-center text-[0.62rem] font-black uppercase text-white/78">vs</span>
      <TeamSide slot={away} align="right" />
    </article>
  );
}

function TieList({ ties, slotTeams, side }: { ties: RoundOf32Tie[]; slotTeams: Map<string, SlotTeam>; side: "left" | "right" }) {
  return (
    <div className="relative space-y-3">
      <span
        aria-hidden="true"
        className={`absolute bottom-7 top-7 w-px bg-mundialGold/25 ${side === "left" ? "right-[-1.5rem]" : "left-[-1.5rem]"}`}
      />
      {ties.map((tie) => (
        <TieRow key={tie.id} tie={tie} slotTeams={slotTeams} side={side} />
      ))}
    </div>
  );
}

function CenterTrophy() {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-4">
      <div className="rounded-[0.65rem] bg-mundialGold px-8 py-3 text-center text-3xl font-black uppercase leading-none text-black shadow-[0_12px_24px_rgba(245,188,66,0.28)]">
        16vos confirmados
      </div>
      <div className="relative flex h-[21rem] w-full max-w-[16rem] items-center justify-center overflow-hidden rounded-[1.2rem] border border-mundialGold/45 bg-[radial-gradient(circle_at_50%_38%,rgba(245,188,66,0.46),rgba(18,18,15,0.94)_62%)] shadow-[0_0_40px_rgba(245,188,66,0.18)]">
        <img
          src={trophyImage}
          alt="Trofeo de la Copa Mundial"
          className="h-[18.5rem] w-auto object-contain drop-shadow-[0_18px_30px_rgba(245,188,66,0.34)]"
          draggable={false}
        />
      </div>
      <p className="text-center text-sm font-black uppercase text-mundialGold">Dorado: confirmados</p>
    </div>
  );
}

export default function KnockoutStage({ matches }: KnockoutStageProps) {
  const slotTeams = buildSlotTeams(matches);

  return (
    <div className="relative z-10 overflow-hidden rounded-lg border border-mundialGold/20 bg-[#050807] px-3 py-4 shadow-[0_0_40px_rgba(0,0,0,0.4)] sm:px-5 sm:py-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,208,190,0.16),transparent_25rem),radial-gradient(circle_at_80%_70%,rgba(48,79,255,0.15),transparent_22rem)]" />
      <div className="pointer-events-none absolute inset-0 opacity-18 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative z-10 mb-5 text-center">
        <p className="text-xs font-black uppercase text-mundialGold">Copa Mundial 2026</p>
        <h3 className="mt-1 text-3xl font-black uppercase leading-none text-white sm:text-4xl">Knockout stage</h3>
      </div>

      <div className="relative z-10 overflow-x-auto pb-2">
        <div className="grid min-h-[43rem] min-w-[1080px] grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)_minmax(0,1fr)] items-center gap-10 rounded-[0.8rem] border border-white/10 bg-black/28 p-5">
          <TieList ties={leftTies} slotTeams={slotTeams} side="left" />
          <CenterTrophy />
          <TieList ties={rightTies} slotTeams={slotTeams} side="right" />
        </div>
      </div>
    </div>
  );
}