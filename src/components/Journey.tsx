import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import config from "../config/portfolio";
import { SectionHead } from "./Reveal";

/* My Journey: the story in seasons. Pick a season; its episodes deal in. */
export default function Journey() {
  const seasons = config.journey;
  const [i, setI] = useState(Math.max(0, seasons.length - 1));
  const s = seasons[i];
  if (!s) return null;

  return (
    <section id="journey" className="relative mb-[5vw] scroll-mt-20">
      <SectionHead id="journey" />
      <div className="gutter">
        <div role="tablist" aria-label="Seasons" className="no-scrollbar -mx-[4%] flex gap-2 overflow-x-auto px-[4%]">
          {seasons.map((x, n) => (
            <button
              key={x.label}
              role="tab"
              aria-selected={n === i}
              onClick={() => setI(n)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-left text-sm transition ${n === i ? "bg-white text-black" : "bg-white/[.06] text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">{x.label}</span>
              <span className="block font-semibold">{x.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-6">
            <motion.h3
              initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5 }}
              className="font-display text-[clamp(2.2rem,4.4vw,4rem)] uppercase leading-none text-white"
            >
              <span className="text-accent">S{String(i + 1).padStart(2, "0")}</span> {s.title}
            </motion.h3>
            <p className="mt-2 text-sm text-white/60">
              {s.years} · {s.episodes.length} episodes · {s.summary}
            </p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {s.episodes.map((e, n) => (
                <motion.li
                  key={e.title}
                  initial={{ opacity: 0, y: 30, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + n * 0.08 }}
                  className="group relative overflow-hidden rounded-md bg-[#1f1f1f] p-5 ring-1 ring-white/5 transition hover:-translate-y-1 hover:ring-white/20"
                >
                  <span className="absolute -right-2 -top-4 font-display text-7xl leading-none text-white/[.05] transition group-hover:text-accent/20">
                    E{String(n + 1).padStart(2, "0")}
                  </span>
                  {e.tag && <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">{e.tag}</span>}
                  <h4 className="mt-1 text-lg font-bold leading-tight text-white">{e.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{e.body}</p>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
