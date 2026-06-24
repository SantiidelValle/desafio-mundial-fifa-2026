import { useEffect, useState } from "react";
import { getFlagImageUrl } from "../utils/flagImages";

interface FlagDisplayProps {
  flag: string;
  name: string;
  align?: "left" | "right" | "center";
}

export default function FlagDisplay({ flag, name, align = "center" }: FlagDisplayProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const alignment = align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right" : "items-center text-center";
  const flagImageUrl = getFlagImageUrl(name);

  useEffect(() => {
    setImageFailed(false);
  }, [name]);

  return (
    <div className={`flex min-w-0 flex-col ${alignment}`}>
      <div className="flex min-h-28 w-full max-w-[15rem] flex-col items-center justify-center rounded-lg bg-black px-3 py-4 shadow-lg">
        {flagImageUrl && !imageFailed ? (
          <img
            src={flagImageUrl}
            alt={`Bandera de ${name}`}
            className="h-24 w-36 rounded-md object-cover shadow-lg sm:h-28 sm:w-44"
            draggable={false}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="leading-none drop-shadow-lg text-7xl sm:text-8xl" aria-hidden>
            {flag}
          </span>
        )}
        <span className="mt-3 max-w-full break-words text-center text-lg font-black uppercase leading-tight tracking-normal text-white sm:text-2xl">
          {name}
        </span>
      </div>
    </div>
  );
}
