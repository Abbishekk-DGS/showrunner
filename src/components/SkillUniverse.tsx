import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import config from "../config/portfolio";
import { allEpisodes, type Placed } from "../lib/episodes";
import { scrollToTarget } from "../lib/scroll";
import { SectionHead } from "./Reveal";

/* My Skill Universe. On wide screens the section pins while you scroll and
   steps through the skill groups one by one; clicking a group jumps there.
   On phones it's a simple tab list. */
export default function SkillUniverse({ onOpen }: { onOpen: (p: Placed) => void }) {
  const groups = config.skills;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (window.innerWidth < 1024) return;
    setActive(Math.min(groups.length - 1, Math.max(0, Math.floor(v * groups.length))));
  });

  const jump = (i: number) => {
    setActive(i);
    const el = ref.current;
    if (!el || window.innerWidth < 1024) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scrollToTarget(top + ((i + 0.5) / groups.length) * span);
  };

  const g = groups[active];
  if (!g) return null;
  const seen = (g.seenIn ?? []).map((s) => allEpisodes.find((p) => p.episode.slug === s)).filter((p): p is Placed => !!p);

  return (
    <section id="skills" ref={ref} className="relative mb-[4vw] scroll-mt-20 lg:h-[calc(100vh+var(--steps)*42vh)]" style={{ ["--steps" as string]: groups.length }}>
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <SectionHead id="skills" aside={<p className="hidden text-sm text-white/50 lg:block">Scroll to explore · {active + 1} / {groups.length}</p>} />
        <div className="gutter grid gap-6 lg:grid-cols-[minmax(16rem,22rem)_1fr] lg:gap-12">
          <ol className="no-scrollbar -mx-[4%] flex gap-2 overflow-x-auto px-[4%] lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0">
            {groups.map((x, i) => (
              <li key={x.name} className="shrink-0">
                <button
                  onClick={() => jump(i)}
                  className={`relative w-full whitespace-nowrap rounded px-4 py-2.5 text-left transition lg:whitespace-normal ${
                    i === active ? "bg-white/10 text-white" : "text-white/45 hover:text-white/80"
                  }`}
                >
                  {i === active && <motion.span layoutId="skill-bar" className="absolute inset-y-1 left-0 hidden w-[3px] rounded bg-accent lg:block" />}
                  <span className="block font-display text-xl uppercase tracking-wide lg:text-2xl">{x.name}</span>
                  <span className="hidden text-xs text-white/45 lg:block">
                    {x.skills.length} skills · {x.tagline}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="relative min-h-[20rem] overflow-hidden rounded-md bg-[#1b1b1b] p-6 ring-1 ring-white/5 sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-16 font-display text-[16rem] leading-none text-white/[.03]">{String(active + 1).padStart(2, "0")}</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{g.tagline}</p>
                <h3 className="mt-1 font-display text-5xl uppercase leading-none text-white">{g.name}</h3>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.skills.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.08 + i * 0.04 }}
                      className="rounded border border-white/15 bg-white/[.04] px-3.5 py-2 text-sm font-semibold text-white transition hover:border-accent hover:bg-accent/10"
                    >
                      {s}
                    </motion.li>
                  ))}
                </ul>
                {seen.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">Seen in</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {seen.map((p) => (
                        <button key={p.episode.slug} onClick={() => onOpen(p)} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white hover:text-black">
                          ▶ {p.episode.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {/* progress through the groups */}
            <div className="absolute inset-x-6 bottom-4 hidden h-[2px] bg-white/10 lg:block sm:inset-x-8">
              <motion.div className="h-full origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
