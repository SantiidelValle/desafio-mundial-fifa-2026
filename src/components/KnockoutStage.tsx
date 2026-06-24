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

function SeedRow({ slot }: { slot: KnockoutSlot }) {
  const flagImage = slot.team ? getFlagImageUrl(slot.team) : null;

  return (
    <div className="grid h-8 grid-cols-[2.35rem_minmax(0,1fr)] overflow-hidden rounded-[0.25rem] border border-white/18 bg-white text-black shadow-sm">
      <div className="flex h-full items-center justify-center overflow-hidden bg-black">
        {flagImage ? (
          <img src={flagImage} alt={`Bandera de ${slot.team}`} className="h-full w-full object-cover" draggable={false} />
        ) : (
          <span className="text-[10px] font-black text-white">{slot.code[0]}</span>
        )}
      </div>
      <div className="flex min-w-0 items-center px-2">
        <span className="truncate text-[11px] font-black uppercase leading-none sm:text-xs">{slot.team ?? slot.code}</span>
      </div>
    </div>
  );
}

function EmptyBox() {
  return <div className="h-7 w-9 rounded-[0.22rem] border-2 border-white/55 bg-black/35 shadow-[0_0_0_1px_rgba(0,0,0,0.28)]" />;
}

function MiniMatch({ match, side }: { match: BracketMatch; side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <article className={`relative grid items-center gap-2 ${isLeft ? "grid-cols-[minmax(0,1fr)_2.25rem]" : "grid-cols-[2.25rem_minmax(0,1fr)]"}`}>
      {isLeft ? (
        <>
          <div className="grid gap-1">
            {match.slots.map((slot) => (
              <SeedRow key={slot.code} slot={slot} />
            ))}
          </div>
          <EmptyBox />
        </>
      ) : (
        <>
          <EmptyBox />
          <div className="grid gap-1">
            {match.slots.map((slot) => (
              <SeedRow key={slot.code} slot={slot} />
            ))}
          </div>
        </>
      )}
      <span className={`absolute top-1/2 h-px w-3 bg-white/40 ${isLeft ? "right-9" : "left-9"}`} />
    </article>
  );
}

function BracketSide({ matches, side }: { matches: BracketMatch[]; side: "left" | "right" }) {
  return (
    <div className="grid gap-3">
      {matches.map((match) => (
        <MiniMatch key={match.id} match={match} side={side} />
      ))}
    </div>
  );
}

export default function KnockoutStage({ matches: _matches }: KnockoutStageProps) {
  const leftMatches = roundOf32Matches.slice(0, 8);
  const rightMatches = roundOf32Matches.slice(8);

  return (
    <div className="relative z-10 overflow-hidden rounded-lg border border-white/12 bg-[#160020] px-3 py-5 shadow-glow sm:px-5">
      <div className="mb-5 text-center">
        <p className="text-xs font-black uppercase text-mundialGold">Copa Mundial 2026</p>
        <h3 className="mt-1 text-3xl font-black uppercase leading-none text-white sm:text-4xl">World Cup Bracket</h3>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1fr)] lg:items-center xl:grid-cols-[minmax(0,1fr)_12rem_minmax(0,1fr)]">
        <BracketSide matches={leftMatches} side="left" />

        <div className="order-first flex justify-center lg:order-none">
          <img
            src={trophyImage}
            alt="Trofeo de la Copa Mundial"
            className="h-40 w-auto object-contain drop-shadow-[0_18px_28px_rgba(245,188,66,0.32)] sm:h-48 lg:h-56"
            draggable={false}
          />
        </div>

        <BracketSide matches={rightMatches} side="right" />
      </div>
    </div>
  );
}
