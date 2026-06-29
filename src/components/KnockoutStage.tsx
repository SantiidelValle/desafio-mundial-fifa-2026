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

interface BracketNode {
  id: string;
  column: number;
  row: number;
  slots: [string, string];
  label?: string;
}

interface ConnectorPairProps {
  column: number;
  fromRows: [number, number];
  toRow: number;
  side: "left" | "right";
}

interface ConnectorSingleProps {
  column: number;
  row: number;
}

const gridColumns =
  "minmax(0,1.28fr) minmax(0,0.18fr) minmax(0,0.78fr) minmax(0,0.16fr) minmax(0,0.62fr) minmax(0,0.14fr) minmax(0,0.5fr) minmax(0,0.12fr) minmax(0,0.68fr) minmax(0,0.12fr) minmax(0,0.5fr) minmax(0,0.14fr) minmax(0,0.62fr) minmax(0,0.16fr) minmax(0,0.78fr) minmax(0,0.18fr) minmax(0,1.28fr)";

const bracketNodes: BracketNode[] = [
  { id: "74", column: 1, row: 1, slots: ["1E", "3D"] },
  { id: "77", column: 1, row: 3, slots: ["1I", "3F"] },
  { id: "73", column: 1, row: 5, slots: ["2A", "2B"] },
  { id: "75", column: 1, row: 7, slots: ["1F", "2C"] },
  { id: "83", column: 1, row: 9, slots: ["2K", "2L"] },
  { id: "84", column: 1, row: 11, slots: ["1H", "2J"] },
  { id: "81", column: 1, row: 13, slots: ["1D", "3B"] },
  { id: "82", column: 1, row: 15, slots: ["1G", "3I"] },
  { id: "89", column: 3, row: 2, slots: ["G74", "G77"] },
  { id: "90", column: 3, row: 6, slots: ["G73", "G75"] },
  { id: "93", column: 3, row: 10, slots: ["G83", "G84"] },
  { id: "94", column: 3, row: 14, slots: ["G81", "G82"] },
  { id: "97", column: 5, row: 4, slots: ["G89", "G90"] },
  { id: "98", column: 5, row: 12, slots: ["G93", "G94"] },
  { id: "101", column: 7, row: 8, slots: ["G97", "G98"] },
  { id: "104", column: 9, row: 8, slots: ["G101", "G102"], label: "Final" },
  { id: "102", column: 11, row: 8, slots: ["G99", "G100"] },
  { id: "99", column: 13, row: 4, slots: ["G91", "G92"] },
  { id: "100", column: 13, row: 12, slots: ["G95", "G96"] },
  { id: "91", column: 15, row: 2, slots: ["G76", "G78"] },
  { id: "92", column: 15, row: 6, slots: ["G79", "G80"] },
  { id: "95", column: 15, row: 10, slots: ["G86", "G88"] },
  { id: "96", column: 15, row: 14, slots: ["G85", "G87"] },
  { id: "76", column: 17, row: 1, slots: ["1C", "2F"] },
  { id: "78", column: 17, row: 3, slots: ["2E", "2I"] },
  { id: "79", column: 17, row: 5, slots: ["1A", "3E"] },
  { id: "80", column: 17, row: 7, slots: ["1L", "3K"] },
  { id: "86", column: 17, row: 9, slots: ["1J", "2H"] },
  { id: "88", column: 17, row: 11, slots: ["2D", "2G"] },
  { id: "85", column: 17, row: 13, slots: ["1B", "3J"] },
  { id: "87", column: 17, row: 15, slots: ["1K", "3L"] }
];

const connectorPairs: ConnectorPairProps[] = [
  { column: 2, fromRows: [1, 3], toRow: 2, side: "left" },
  { column: 2, fromRows: [5, 7], toRow: 6, side: "left" },
  { column: 2, fromRows: [9, 11], toRow: 10, side: "left" },
  { column: 2, fromRows: [13, 15], toRow: 14, side: "left" },
  { column: 4, fromRows: [2, 6], toRow: 4, side: "left" },
  { column: 4, fromRows: [10, 14], toRow: 12, side: "left" },
  { column: 6, fromRows: [4, 12], toRow: 8, side: "left" },
  { column: 12, fromRows: [4, 12], toRow: 8, side: "right" },
  { column: 14, fromRows: [2, 6], toRow: 4, side: "right" },
  { column: 14, fromRows: [10, 14], toRow: 12, side: "right" },
  { column: 16, fromRows: [1, 3], toRow: 2, side: "right" },
  { column: 16, fromRows: [5, 7], toRow: 6, side: "right" },
  { column: 16, fromRows: [9, 11], toRow: 10, side: "right" },
  { column: 16, fromRows: [13, 15], toRow: 14, side: "right" }
];

const connectorSingles: ConnectorSingleProps[] = [
  { column: 8, row: 8 },
  { column: 10, row: 8 }
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
  argelia: "ALG",
  colombia: "COL",
  ghana: "GHA"
};

const knownAdvancedTeams: Record<string, string> = {
  G73: "CanadÃ¡"
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

function buildTeamDirectory(matches: Match[]) {
  const teams = new Map<string, SlotTeam>();

  for (const match of matches) {
    teams.set(normalizeTeamName(match.equipoLocal), {
      code: normalizeTeamName(match.equipoLocal),
      team: match.equipoLocal,
      flag: match.banderaLocal
    });
    teams.set(normalizeTeamName(match.equipoVisitante), {
      code: normalizeTeamName(match.equipoVisitante),
      team: match.equipoVisitante,
      flag: match.banderaVisitante
    });
  }

  return teams;
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

function buildAdvancedSlots(matches: Match[], teamDirectory: Map<string, SlotTeam>) {
  const advancedSlots = new Map<string, SlotTeam>();

  for (const match of matches.filter((item) => item.fase !== "Fase de grupos")) {
    if (typeof match.resultadoLocal !== "number" || typeof match.resultadoVisitante !== "number") {
      continue;
    }

    if (match.resultadoLocal === match.resultadoVisitante) {
      continue;
    }

    const winner = match.resultadoLocal > match.resultadoVisitante ? match.equipoLocal : match.equipoVisitante;
    const winnerFlag = match.resultadoLocal > match.resultadoVisitante ? match.banderaLocal : match.banderaVisitante;
    advancedSlots.set(`G${match.id}`, {
      code: `G${match.id}`,
      team: winner,
      flag: winnerFlag
    });
  }

  for (const [code, team] of Object.entries(knownAdvancedTeams)) {
    if (advancedSlots.has(code)) {
      continue;
    }

    const knownTeam = teamDirectory.get(normalizeTeamName(team));
    advancedSlots.set(code, {
      code,
      team: knownTeam?.team ?? team,
      flag: knownTeam?.flag
    });
  }

  return advancedSlots;
}

function resolveSlot(code: string, slotTeams: Map<string, SlotTeam>, advancedSlots: Map<string, SlotTeam>): SlotTeam {
  if (code.startsWith("G")) {
    return advancedSlots.get(code) ?? { code };
  }

  return slotTeams.get(code) ?? { code };
}

function displayCode(slot: SlotTeam) {
  if (!slot.team) return "";
  return teamCodes[normalizeTeamName(slot.team)] ?? slot.team.slice(0, 3).toUpperCase();
}

function connectorCenter(row: number, start: number, span: number) {
  return `${(((row - start) + 0.5) / span) * 100}%`;
}

function PatternBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[#030403]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(231,43,45,0.16),transparent_18rem),radial-gradient(circle_at_82%_16%,rgba(0,168,107,0.14),transparent_17rem),radial-gradient(circle_at_50%_110%,rgba(22,77,229,0.18),transparent_24rem)]" />
      <span className="absolute -left-20 top-4 select-none text-[clamp(12rem,22vw,23rem)] font-black leading-none text-white/[0.035]">26</span>
      <span className="absolute left-[32%] -top-24 select-none text-[clamp(13rem,24vw,25rem)] font-black leading-none text-white/[0.026]">26</span>
      <span className="absolute -right-8 bottom-[-6rem] select-none text-[clamp(13rem,23vw,24rem)] font-black leading-none text-white/[0.03]">26</span>
      <div className="absolute left-[-9rem] top-[-7rem] h-[22rem] w-[29rem] rotate-[-8deg] rounded-[5rem] border-[2.8rem] border-white/[0.032]" />
      <div className="absolute right-[-10rem] top-[4rem] h-[24rem] w-[30rem] rotate-[12deg] rounded-[5rem] border-[3rem] border-white/[0.03]" />
      <div className="absolute bottom-[-11rem] left-[27%] h-[22rem] w-[35rem] rotate-[-4deg] rounded-[5rem] border-[2.4rem] border-white/[0.024]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.14]" />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

function TeamFlag({ slot }: { slot: SlotTeam }) {
  const flagImage = slot.team ? getFlagImageUrl(slot.team) : null;

  return (
    <span className="flex h-[clamp(0.82rem,1.6vw,1.28rem)] w-[clamp(1.2rem,2.3vw,1.86rem)] shrink-0 items-center justify-center overflow-hidden rounded-[0.16rem] border border-white/20 bg-white/8 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]">
      {flagImage ? (
        <img src={flagImage} alt={`Bandera de ${slot.team}`} className="h-full w-full object-cover" draggable={false} />
      ) : (
        <span className="text-[0.7rem]">{slot.flag ?? ""}</span>
      )}
    </span>
  );
}

function SlotRow({ slot, align }: { slot: SlotTeam; align: "left" | "right" }) {
  const code = displayCode(slot);
  const isTeam = Boolean(slot.team);

  return (
    <div
      title={slot.team ?? slot.code}
      className={`flex min-w-0 items-center gap-1.5 ${align === "right" ? "justify-end text-right" : ""}`}
    >
      {align === "left" && <TeamFlag slot={slot} />}
      <span
        className={`min-w-0 truncate text-[clamp(0.56rem,0.78vw,0.86rem)] font-black uppercase leading-none tracking-normal ${
          isTeam ? "text-mundialGold" : "text-white/22"
        }`}
      >
        {code || slot.code}
      </span>
      {align === "right" && <TeamFlag slot={slot} />}
    </div>
  );
}

function BracketMatchBox({
  node,
  slotTeams,
  advancedSlots
}: {
  node: BracketNode;
  slotTeams: Map<string, SlotTeam>;
  advancedSlots: Map<string, SlotTeam>;
}) {
  const [homeCode, awayCode] = node.slots;
  const home = resolveSlot(homeCode, slotTeams, advancedSlots);
  const away = resolveSlot(awayCode, slotTeams, advancedSlots);
  const isFinal = node.id === "104";
  const align = node.column > 9 ? "right" : "left";

  return (
    <article
      aria-label={node.label ?? `Partido ${node.id}`}
      className={`relative z-10 self-center rounded-[0.32rem] border bg-black/68 px-1.5 py-1 shadow-[0_10px_18px_rgba(0,0,0,0.26),inset_0_0_0_1px_rgba(255,255,255,0.045)] ${
        isFinal ? "border-mundialGold/56" : "border-mundialGold/28"
      }`}
      style={{ gridColumn: node.column, gridRow: `${node.row} / span 1` }}
    >
      {isFinal && (
        <img
          src={trophyImage}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-auto -translate-x-1/2 -translate-y-1/2 opacity-20"
          draggable={false}
        />
      )}
      <div className="relative z-10 grid gap-1">
        {isFinal && <p className="text-center text-[0.48rem] font-black uppercase leading-none text-mundialGold">Final</p>}
        <SlotRow slot={home} align={isFinal ? "left" : align} />
        <SlotRow slot={away} align={isFinal ? "right" : align} />
      </div>
    </article>
  );
}

function ConnectorPair({ column, fromRows, toRow, side }: ConnectorPairProps) {
  const start = Math.min(...fromRows, toRow);
  const end = Math.max(...fromRows, toRow);
  const span = end - start + 1;
  const [firstRow, secondRow] = [...fromRows].sort((a, b) => a - b) as [number, number];
  const first = connectorCenter(firstRow, start, span);
  const second = connectorCenter(secondRow, start, span);
  const target = connectorCenter(toRow, start, span);
  const sourceLine = side === "left" ? "left-0 right-1/2" : "left-1/2 right-0";
  const targetLine = side === "left" ? "left-1/2 right-0" : "left-0 right-1/2";

  return (
    <div
      aria-hidden="true"
      className="relative z-0"
      style={{ gridColumn: column, gridRow: `${start} / ${end + 1}` }}
    >
      <span className="absolute left-1/2 w-px -translate-x-1/2 bg-mundialGold/44" style={{ top: first, bottom: `calc(100% - ${second})` }} />
      {fromRows.map((row) => (
        <span
          key={`${column}-${row}`}
          className={`absolute h-px bg-mundialGold/44 ${sourceLine}`}
          style={{ top: connectorCenter(row, start, span) }}
        />
      ))}
      <span className={`absolute h-px bg-mundialGold/54 ${targetLine}`} style={{ top: target }} />
    </div>
  );
}

function ConnectorSingle({ column, row }: ConnectorSingleProps) {
  return (
    <div aria-hidden="true" className="relative z-0" style={{ gridColumn: column, gridRow: `${row} / span 1` }}>
      <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-mundialGold/56" />
    </div>
  );
}

function RoundLabels() {
  const labels = [
    { text: "16avos", column: 1 },
    { text: "Octavos", column: 3 },
    { text: "Cuartos", column: 5 },
    { text: "Semis", column: 7 },
    { text: "Final", column: 9 },
    { text: "Semis", column: 11 },
    { text: "Cuartos", column: 13 },
    { text: "Octavos", column: 15 },
    { text: "16avos", column: 17 }
  ];

  return (
    <div className="grid w-full items-end gap-x-1 px-1" style={{ gridTemplateColumns: gridColumns }}>
      {labels.map((label) => (
        <p
          key={`${label.text}-${label.column}`}
          className="truncate text-center text-[clamp(0.48rem,0.7vw,0.68rem)] font-black uppercase text-white/48"
          style={{ gridColumn: label.column }}
        >
          {label.text}
        </p>
      ))}
    </div>
  );
}

export default function KnockoutStage({ matches }: KnockoutStageProps) {
  const teamDirectory = buildTeamDirectory(matches);
  const slotTeams = buildSlotTeams(matches);
  const advancedSlots = buildAdvancedSlots(matches, teamDirectory);

  return (
    <div className="relative z-10 w-full overflow-hidden rounded-lg border border-mundialGold/20 bg-[#050807] p-2 shadow-[0_0_40px_rgba(0,0,0,0.4)] sm:p-3">
      <PatternBackdrop />

      <div className="relative z-10 mb-2 text-center">
        <p className="text-[0.62rem] font-black uppercase text-mundialGold">Copa Mundial 2026</p>
        <h3 className="mt-0.5 text-[clamp(1.35rem,3vw,2.35rem)] font-black uppercase leading-none text-white">Knockout stage</h3>
      </div>

      <div className="relative z-10 flex h-[clamp(28rem,calc(100vh-18rem),42rem)] w-full flex-col overflow-hidden rounded-[0.65rem] border border-white/10 bg-black/28 p-2 sm:p-3">
        <RoundLabels />
        <div
          className="relative grid min-h-0 flex-1 items-center gap-x-1"
          style={{
            gridTemplateColumns: gridColumns,
            gridTemplateRows: "repeat(15, minmax(0, 1fr))"
          }}
        >
          {connectorPairs.map((connector) => (
            <ConnectorPair key={`${connector.column}-${connector.fromRows.join("-")}-${connector.toRow}`} {...connector} />
          ))}
          {connectorSingles.map((connector) => (
            <ConnectorSingle key={`${connector.column}-${connector.row}`} {...connector} />
          ))}
          {bracketNodes.map((node) => (
            <BracketMatchBox key={node.id} node={node} slotTeams={slotTeams} advancedSlots={advancedSlots} />
          ))}
        </div>
      </div>
    </div>
  );
}