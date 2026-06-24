import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  themeMode: "dark" | "light";
  onToggle: () => void;
}

export default function ThemeToggle({ themeMode, onToggle }: ThemeToggleProps) {
  const Icon = themeMode === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/12 text-white shadow-lg backdrop-blur-md transition hover:bg-white/22"
      title={themeMode === "dark" ? "Modo claro" : "Modo oscuro"}
      aria-label={themeMode === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
    >
      <Icon size={22} />
    </button>
  );
}
