import { motion, useReducedMotion } from "framer-motion";
import config from "../config/portfolio";
import { allEpisodes, type Placed } from "../lib/episodes";
import Poster from "./Poster";
import Rail from "./Rail";

/* Top Picks: the best projects, ranked, with the big hollow numerals. */
export default function TopPicks({ onOpen }: { onOpen: (p: Placed) => void }) {
  const reduce = useReducedMotion();
  const picks = config.topPicks.map((s) => allEpisodes.find((p) => p.episode.slug === s)).filter((p): p is Placed => !!p);
  if (!picks.length) return null;
  return (
    <div id="picks" className="scroll-mt-20">
      <Rail title={config.sections.picks.title}>
        {picks.map((p, i) => (
          <motion.div
            role="listitem"
            key={p.episode.slug}
            className="row-card group flex shrink-0 snap-start items-stretch"
            initial={reduce ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
          >
            <span className="numeral flex w-1/2 select-none items-end justify-end text-[max(7rem,10vw)] leading-[0.8]" aria-hidden>
              {i + 1}
            </span>
            <button onClick={() => onOpen(p)} className="relative -ml-[6%] aspect-[2/3] w-1/2 overflow-hidden rounded-[4px] text-left transition duration-300 group-hover:scale-[1.05]" aria-label={`#${i + 1}: ${p.episode.title}`}>
              <div className="absolute inset-0 [&>div]:h-full">
                <Poster episode={p.episode} showTitle={false} />
              </div>
              <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <span className="absolute inset-x-[8%] bottom-[6%] font-display text-[max(1.1rem,1.3vw)] uppercase leading-[0.92] text-white">{p.episode.title}</span>
            </button>
          </motion.div>
        ))}
      </Rail>
    </div>
  );
}
