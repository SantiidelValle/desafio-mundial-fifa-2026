import { motion } from "framer-motion";
import triondaBall from "../assets/trionda-ball.jpg";

interface TriondaBallProps {
  size?: number;
  active?: boolean;
}

export default function TriondaBall({ size = 112, active = false }: TriondaBallProps) {
  const animationProps = active
    ? {
        animate: { y: [0, -8, 0] },
        transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" as const }
      }
    : {};

  return (
    <motion.div
      aria-label="Pelota oficial Adidas Trionda"
      className="relative shrink-0 overflow-hidden rounded-full bg-white shadow-glow ring-2 ring-white/70"
      style={{ width: size, height: size }}
      {...animationProps}
    >
      <img
        src={triondaBall}
        alt="Pelota oficial Adidas Trionda de la Copa Mundial 2026"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </motion.div>
  );
}
