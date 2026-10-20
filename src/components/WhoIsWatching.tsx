import { motion } from "framer-motion";
import config from "../config/portfolio";
import type { Viewer } from "../config/types";
import { asset } from "../lib/util";

/* A profile tile: a coloured square with a simple face. */
export function Avatar({ viewer, className = "h-8 w-8" }: { viewer: Viewer; className?: string }) {
  const photo = viewer.main && config.profile.portrait;
  if (photo)
    return (
      <span className={`${className} relative block aspect-square shrink-0 overflow-hidden rounded`} style={{ background: viewer.color }}>
        <img src={asset(photo)} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_12%]" />
      </span>
    );
  return (
    <svg viewBox="0 0 100 100" className={`${className} shrink-0 rounded`} aria-hidden>
      <defs>
        <linearGradient id={`av-${viewer.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={viewer.color} />
          <stop offset="1" stopColor={viewer.color} stopOpacity=".78" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#av-${viewer.id})`} />
      <rect width="100" height="100" fill="black" opacity=".08" />
      <rect x="30" y="33" width="9" height="15" rx="2" fill="#fff" />
      <rect x="61" y="33" width="9" height="15" rx="2" fill="#fff" />
      <path d="M26 62c14 14 34 14 48 0" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export default function WhoIsWatching({ onPick }: { onPick: (v: Viewer) => void }) {
  const main = config.viewers.find((v) => v.main) ?? config.viewers[0];
  return (
    <motion.div
      className="fixed inset-0 z-[65] grid place-items-center overflow-y-auto bg-ink px-4 py-16"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.45 }}
    >
      <div className="text-center">
        <h1 className="text-[max(2rem,3.5vw)] font-medium text-white">Who's watching?</h1>
        <ul className="mx-auto mt-[2vw] flex max-w-[90vw] flex-wrap justify-center gap-[2vw]">
          {config.viewers.map((v, i) => (
            <motion.li key={v.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}>
              <button onClick={() => onPick(v)} className="group flex w-[max(96px,10vw)] max-w-[200px] flex-col items-center text-center outline-none">
                <span className="relative block w-full rounded border-[0.3em] border-transparent transition duration-300 group-hover:scale-105 group-hover:border-white group-focus-visible:border-white">
                  <Avatar viewer={v} className="h-auto w-full" />
                  {v.main && <span className="absolute -right-2 -top-2 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">MAIN</span>}
                </span>
                <span className="mt-[0.6em] text-[max(0.95rem,1.3vw)] text-[#808080] transition group-hover:text-white">
                  {v.name}
                </span>
                <span className="mt-1 text-[max(.7rem,.8vw)] leading-snug text-[#666] transition group-hover:text-white/70">{v.subtitle}</span>
              </button>
            </motion.li>
          ))}
        </ul>
        <p className="mx-auto mt-[2.5vw] max-w-md text-[max(.8rem,.9vw)] text-[#808080]">
          Every profile watches the same true story. It only changes what plays first.
        </p>
        <button
          onClick={() => onPick(main)}
          className="mt-[3.5vw] border border-[#808080] px-[1.5em] py-[0.5em] text-[max(0.85rem,1.1vw)] uppercase tracking-[2px] text-[#808080] transition hover:border-white hover:text-white"
        >
          Skip
        </button>
      </div>
    </motion.div>
  );
}
