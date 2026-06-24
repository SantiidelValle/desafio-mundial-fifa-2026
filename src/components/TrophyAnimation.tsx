import { motion } from "framer-motion";
import worldCupEmblem from "../assets/world-cup-26-emblem.webp";
import worldCupTrophy from "../assets/world-cup-trophy.jpg";

interface TrophyAnimationProps {
  compact?: boolean;
  variant?: "trophy" | "emblem";
}

export default function TrophyAnimation({ compact = false, variant }: TrophyAnimationProps) {
  const image = variant === "emblem" || compact ? worldCupEmblem : worldCupTrophy;
  const label = variant === "emblem" || compact ? "Emblema oficial FIFA World Cup 2026" : "Copa Mundial de la FIFA";
  const sizeClass = compact ? "h-10 w-10" : "h-56 w-48 sm:h-72 sm:w-60";

  return (
    <motion.div
      className={`relative ${sizeClass} drop-shadow-2xl`}
      aria-label={label}
      animate={{ y: [0, -8, 0], scale: [1, 1.03, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className={`relative h-full w-full overflow-hidden ${compact ? "rounded-full bg-white" : "rounded-lg border border-white/20 bg-white/95 shadow-glow"}`}>
        <img
          src={image}
          alt={label}
          className={`h-full w-full ${variant === "emblem" || compact ? "object-contain p-1" : "object-cover"}`}
          draggable={false}
        />
        {!compact && variant !== "emblem" && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/28 via-transparent to-white/8" />
        )}
      </div>
      {!compact && (
        <div className="absolute inset-x-6 bottom-5 rounded-full bg-white/90 px-2 py-1 text-center text-[10px] font-black uppercase text-midnight shadow">
          {variant === "emblem" ? "FIFA World Cup 26" : "FIFA World Cup Trophy"}
        </div>
      )}
    </motion.div>
  );
}
