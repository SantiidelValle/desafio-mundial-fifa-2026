interface ProgressBarProps {
  value: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ value, total, label }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div className="w-full" aria-label={label ?? "Progreso"}>
      <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase text-white/75">
        <span>{label ?? "Progreso"}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/16 ring-1 ring-white/20">
        <div
          className="h-full rounded-full bg-gradient-to-r from-mundialRed via-mundialBlue to-mundialGreen transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
