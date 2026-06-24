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

const roundOf32Matches: BracketMatch[] = [
  { id: 73, slots: [{ code: "2A" }, { code: "2B" }] },
  { id: 74, slots: [{ code: "1E", team: "Alemania" }, { code: "3ABCDF" }] },
  { id: 75, slots: [{ code: "1F" }, { code: "2C" }] },
  { id: 76, slots: [{ code: "1C" }, { code: "2F" }] },
  { id: 77, slots: [{ code: "1I" }, { code: "3CDFGH" }] },
  { id: 78, slots: [{ code: "2E" }, { code: "2I" }] },
  { id: 79, slots: [{ code: "1A", team: "México" }, { code: "3CEFHI" }] },
  { id: 80, slots: [{ code: "1L" }, { code: "3EHIJK" }] },
  { id: 81, slots: [{ code: "1D", team: "Estados Unidos" }, { code: "3BEFIJ" }] },
  { id: 82, slots: [{ code: "1G" }, { code: "3AEHIJ" }] },
  { id: 83, slots: [{ code: "2K" }, { code: "2L" }] },
  { id: 84, slots: [{ code: "1H" }, { code: "2J" }] },
  { id: 85, slots: [{ code: "1B" }, { code: "3EFGIJ" }] },
  { id: 86, slots: [{ code: "1J", team: "Argentina" }, { code: "2H" }] },
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

function SlotBox({ slot }: { slot: KnockoutSlot }) {
  const flagImage = slot.team ? getFlagImageUrl(slot.team) : null;

  return (
    <div
      className="flex h-7 w-14 items-center justify-center overflow-hidden rounded-[0.25rem] border border-white/20 bg-black/40 text-[9px] font-black uppercase text-white shadow-sm"
      title={slot.team ?? slot.code}
    >
      {flagImage ? <img src={flagImage} alt={`Bandera de ${slot.team}`} className="h-full w-full object-cover" draggable={false} /> : slot.code}
    </div>
  );
}

function MatchBox({ match }: { match: BracketMatch }) {
  return (
    <article className="flex flex-col items-center gap-1" aria-label={`Partido ${match.id}`}>
      {match.slots.map((slot) => (
        <SlotBox key={`${match.id}-${slot.code}`} slot={slot} />
      ))}
    </article>
  );
}

function BracketColumn({ label, matches }: { label: string; matches: BracketMatch[] }) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <p className="mb-2 text-center text-[10px] font-black uppercase text-white/50">{label}</p>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-around">
        {matches.map((match) => (
          <MatchBox key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

function FinalColumn() {
  return (
    <div className="flex h-full min-w-0 flex-col items-center justify-center gap-4">
      <img
        src={trophyImage}
        alt="Trofeo de la Copa Mundial"
        className="h-40 w-auto object-contain drop-shadow-[0_18px_28px_rgba(245,188,66,0.32)]"
        draggable={false}
      />
      <div>
        <p className="mb-2 text-center text-[10px] font-black uppercase text-mundialGold">Final</p>
        <MatchBox match={finalMatch} />
      </div>
    </div>
  );
}

export default function KnockoutStage({ matches: _matches }: KnockoutStageProps) {
  return (
    <div className="relative z-10 overflow-hidden rounded-lg border border-white/12 bg-[#160020] px-3 py-5 shadow-glow sm:px-5">
      <div className="mb-5 text-center">
        <p className="text-xs font-black uppercase text-mundialGold">Copa Mundial 2026</p>
        <h3 className="mt-1 text-3xl font-black uppercase leading-none text-white sm:text-4xl">World Cup Bracket</h3>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="mx-auto grid h-[42rem] min-w-[920px] max-w-[1060px] grid-cols-[4rem_4rem_4rem_4rem_10rem_4rem_4rem_4rem_4rem] gap-3">
          <BracketColumn label="32" matches={leftRoundOf32} />
          <BracketColumn label="16" matches={leftRoundOf16} />
          <BracketColumn label="8" matches={leftQuarterFinals} />
          <BracketColumn label="4" matches={leftSemiFinal} />
          <FinalColumn />
          <BracketColumn label="4" matches={rightSemiFinal} />
          <BracketColumn label="8" matches={rightQuarterFinals} />
          <BracketColumn label="16" matches={rightRoundOf16} />
          <BracketColumn label="32" matches={rightRoundOf32} />
        </div>
      </div>
    </div>
  );
}
