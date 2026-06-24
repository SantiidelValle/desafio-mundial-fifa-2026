import { motion } from "framer-motion";
import { Shield, Swords, Zap } from "lucide-react";
import type { Difficulty } from "../types/Difficulty";

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const options: Array<{
  id: Difficulty;
  title: string;
  description: string;
  points: string;
  Icon: typeof Shield;
}> = [
  {
    id: "standard",
    title: "Estándar",
    description: "Adiviná el resultado exacto de cada partido.",
    points: "1 punto por partido",
    Icon: Shield
  },
  {
    id: "hard",
    title: "Difícil",
    description: "Resultado exacto más todos los goleadores.",
    points: "2 puntos por partido",
    Icon: Swords
  },
  {
    id: "impossible",
    title: "Imposible",
    description: "Resultado, goleadores y minuto exacto de cada gol.",
    points: "3 puntos por partido",
    Icon: Zap
  }
];

export default function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {options.map(({ id, title, description, points, Icon }) => {
        const selected = value === id;

        return (
          <motion.button
            key={id}
            type="button"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(id)}
            className={`rounded-lg border p-4 text-left transition ${
              selected
                ? "border-white bg-white text-black shadow-glow"
                : "border-white/24 bg-black/72 text-white hover:bg-white/12"
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${selected ? "bg-black text-white" : "bg-white text-black"}`}>
                <Icon size={21} />
              </span>
              <span className={`rounded-md px-3 py-1 text-xs font-black uppercase ${selected ? "bg-black text-white" : "bg-white text-black"}`}>
                {points}
              </span>
            </div>
            <h3 className="text-lg font-black uppercase tracking-normal">{title}</h3>
            <p className={`mt-2 text-sm leading-relaxed ${selected ? "text-midnight/72" : "text-white/74"}`}>{description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
