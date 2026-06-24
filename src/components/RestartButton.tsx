import { RotateCcw } from "lucide-react";

interface RestartButtonProps {
  onRestart: () => void;
  label?: string;
}

export default function RestartButton({ onRestart, label = "Reiniciar" }: RestartButtonProps) {
  return (
    <button
      type="button"
      onClick={onRestart}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/12 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-white/22"
    >
      <RotateCcw size={18} />
      {label}
    </button>
  );
}
