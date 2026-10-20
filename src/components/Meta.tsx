/* Pieces of the meta line: "98% Match  [S1:E2]  Automation  HD" */
export function Match({ value }: { value: number }) {
  return <span className="font-bold text-match">{value}% Match</span>;
}

export function Rating({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap border border-white/40 px-[.4em] text-[.9em] leading-[1.35] text-white/90">
      {children}
    </span>
  );
}

export function HD() {
  return (
    <span className="rounded-[3px] border border-white/40 px-[.4em] text-[.65em] font-semibold leading-[1.5] text-white/90">
      HD
    </span>
  );
}

/** Tags separated by small grey dots. */
export function Dots({ items }: { items: string[] }) {
  return (
    <span className="flex flex-wrap items-center gap-x-1.5">
      {items.map((t, i) => (
        <span key={t} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[#646464]">•</span>}
          {t}
        </span>
      ))}
    </span>
  );
}
