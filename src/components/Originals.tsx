import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { allEpisodes, type Placed } from "../lib/episodes";
import { Info, Mail, Play } from "./icons";
import { Dots, Match, Rating } from "./Meta";
import Poster from "./Poster";
import { SectionHead } from "./Reveal";
import config from "../config/portfolio";

/* Originals: every project as a big feature card. On wide screens the
   section pins and vertical scrolling drives the cards sideways; on phones
   it's a swipeable row. */
export default function Originals({ onOpen }: { onOpen: (p: Placed) => void }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [wide, setWide] = useState(false);
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);

  useEffect(() => {
    const measure = () => {
      const isWide = window.innerWidth >= 1024 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setWide(isWide);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => setIndex(Math.min(allEpisodes.length - 1, Math.round(v * (allEpisodes.length - 1)))));

  if (!allEpisodes.length) return null;
  const cards = allEpisodes.map((p, i) => <Feature key={p.episode.slug} placed={p} n={i + 1} onOpen={onOpen} />);

  if (!wide) {
    return (
      <section id="originals" className="relative mb-[5vw] scroll-mt-20">
        <SectionHead id="originals" />
        <div className="no-scrollbar gutter flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[4%] pb-2" ref={track}>
          {cards}
        </div>
      </section>
    );
  }

  return (
    <section id="originals" ref={ref} className="relative mb-[4vw] scroll-mt-0" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <SectionHead
          id="originals"
          aside={
            <p className="font-display text-3xl text-white/40">
              <span className="text-white">{String(index + 1).padStart(2, "0")}</span> / {String(allEpisodes.length).padStart(2, "0")}
            </p>
          }
        />
        <motion.div ref={track} style={{ x }} className="gutter flex w-max gap-[1.2vw]">
          {cards}
        </motion.div>
        <div className="gutter mt-[2vw]">
          <div className="h-[2px] w-full bg-white/10">
            <motion.div className="h-full origin-left bg-accent" style={{ scaleX: smooth }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ placed, n, onOpen }: { placed: Placed; n: number; onOpen: (p: Placed) => void }) {
  const { episode } = placed;
  const season = config.seasons[placed.seasonIndex];
  return (
    <article className="group relative w-[86vw] shrink-0 snap-start overflow-hidden rounded-md bg-surface sm:w-[60vw] lg:w-[46vw]">
      <div className="relative aspect-[16/8] overflow-hidden">
        <div className="absolute inset-0 transition duration-700 group-hover:scale-105 [&>div]:h-full">
          <Poster episode={episode} showTitle={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
        <span className="absolute right-[4%] top-[4%] font-display text-[min(9rem,12vw)] leading-[0.8] text-white/10">{String(n).padStart(2, "0")}</span>
        <div className="absolute inset-x-[5%] bottom-[6%]">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            {season.title}: {season.name} · {placed.code}
          </p>
          <h3 className="mt-1 font-display text-[clamp(2rem,3.6vw,3.6rem)] uppercase leading-[0.88] text-white">{episode.title}</h3>
        </div>
        {episode.badge && <span className="absolute left-[5%] top-[6%] rounded-sm bg-accent px-2 py-0.5 text-[11px] font-bold text-white">{episode.badge}</span>}
      </div>
      <div className="px-[5%] pb-6 pt-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
          <Match value={placed.match} />
          <Rating>{placed.code}</Rating>
          {episode.meta && <span>{episode.meta}</span>}
        </div>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-white/80">
          <span className="font-bold text-white">{episode.logline}</span> {episode.details}
        </p>
        <div className="mt-2 text-xs text-white/55">
          <Dots items={episode.tags} />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => onOpen(placed)} className="flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-bold text-black hover:bg-white/80">
            <Play className="h-4 w-4" /> Watch
          </button>
          <button onClick={() => onOpen(placed)} className="flex items-center gap-2 rounded bg-[rgba(109,109,110,.7)] px-4 py-2 text-sm font-bold text-white hover:bg-[rgba(109,109,110,.4)]">
            <Info className="h-4 w-4" /> More Info
          </button>
          <a href={`mailto:${config.profile.email}?subject=${encodeURIComponent(episode.title)}`} aria-label={`Ask about ${episode.title}`} className="ml-auto grid h-9 w-9 place-items-center rounded-full border-2 border-white/40 text-white hover:border-white">
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
