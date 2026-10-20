import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import config from "../config/portfolio";
import type { Viewer } from "../config/types";
import { useFaded } from "../lib/fade";
import { asset } from "../lib/util";
import Backdrop from "./Backdrop";
import { Info, Play } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

/* The hero, laid out like a streaming home page billboard: full-bleed
   artwork, title treatment, Top 10 badge, synopsis, Play and More Info. */
export default function Billboard({
  viewer,
  onPlay,
  onInfo,
  onResume,
}: {
  viewer: Viewer | null;
  onPlay: () => void;
  onInfo: () => void;
  onResume: () => void;
}) {
  const { profile } = config;
  const reduce = useReducedMotion();
  // scroll: the art drifts slower than the page and the text lifts away
  const { scrollY } = useScroll();
  const artY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : 180]);
  const artScale = useTransform(scrollY, [0, 900], [1, reduce ? 1 : 1.08]);
  const textY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -90]);
  const textFade = useTransform(scrollY, [0, 500], [1, reduce ? 1 : 0]);
  const portrait = profile.portrait ? asset(profile.portrait) : null;
  const small = profile.portraitSmall ? asset(profile.portraitSmall) : portrait;
  const faded = useFaded(portrait, "left");

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section id="top" className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden md:min-h-[600px]">
      {/* full-bleed artwork: the photo, blurred to fill the frame… */}
      <motion.div className="absolute inset-0" style={{ y: artY, scale: artScale }}>
      {portrait && (
        <img src={small ?? portrait} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-3xl saturate-[1.1]" />
      )}
      {/* …and sharp on the right: the plain photo on phones, a copy with
          the left fade painted in on wider screens */}
      {portrait && (
        <motion.img
          src={small ?? portrait}
          srcSet={small && small !== portrait ? `${small} 640w, ${portrait} 1200w` : undefined}
          sizes="100vw"
          alt={profile.name}
          fetchPriority="high"
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "easeOut" }}
          className="absolute right-0 top-0 h-[78%] w-full object-cover object-[50%_18%] md:hidden"
        />
      )}
      {faded && (
        <motion.img
          src={faded}
          alt=""
          aria-hidden
          initial={reduce ? false : { scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ scale: { duration: 6, ease: "easeOut" }, opacity: { duration: 0.6 } }}
          className="absolute right-0 top-0 hidden h-full w-[62%] object-cover object-[50%_18%] md:block"
        />
      )}
      <Backdrop />
      </motion.div>

      {/* the vignettes */}
      <div className="absolute inset-0 bg-[linear-gradient(77deg,rgba(0,0,0,.75),rgba(0,0,0,.25)_45%,transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,transparent,rgba(20,20,20,.6)_45%,var(--ink))]" />

      <motion.div style={{ y: textY, opacity: textFade }} className="gutter absolute inset-x-0 bottom-[22%] z-10 md:bottom-[22%] md:w-[52%] md:pr-0 lg:w-[46%] xl:w-[42%]">
        <motion.p {...rise(0.2)} className="flex items-center gap-2 text-[max(.7rem,.95vw)] font-semibold uppercase tracking-[0.35em] text-[#dcdcdc]">
          <span className="font-display text-[max(1.6rem,2.3vw)] leading-none tracking-normal text-accent">{profile.studio.slice(0, 1)}</span>
          {profile.seriesLabel}
        </motion.p>

        <motion.h1
          {...rise(0.3)}
          className="mt-1 font-display text-[clamp(3.6rem,6.6vw,8rem)] uppercase leading-[0.82] text-white [text-shadow:0_4px_30px_rgba(0,0,0,.45)]"
        >
          {profile.title.map((line, i) =>
            i === 0 && profile.highlight ? (
              <span key={i} className="block">
                <span className="bg-gradient-to-b from-[#ff5a64] to-accent bg-clip-text text-transparent">{line.slice(0, profile.highlight)}</span>
                {line.slice(profile.highlight)}
              </span>
            ) : (
              <span key={i} className="block">
                {line}
              </span>
            ),
          )}
        </motion.h1>
        <motion.p {...rise(0.35)} className="mt-2 text-[max(.7rem,.85vw)] font-bold uppercase tracking-[0.3em] text-white/80">
          <span className="text-accent">The {profile.seriesLabel}</span> · {profile.role}
        </motion.p>
        <motion.div {...rise(0.38)} className="mt-3 flex flex-wrap items-center gap-2 text-[max(.72rem,.8vw)] text-white/80">
          <span className="font-bold text-match">{profile.match ?? 98}% Match</span>
          <span>{profile.year}</span>
          {profile.badges.map((b) => (
            <span key={b} className="rounded-sm border border-white/30 px-1.5 py-px">{b}</span>
          ))}
        </motion.div>

        {profile.rank && (
          <motion.div {...rise(0.4)} className="mt-[1.4vw] flex items-center gap-2.5">
            <TopTen />
            <span className="text-[max(1rem,1.45vw)] font-bold text-white [text-shadow:0_2px_8px_rgba(0,0,0,.5)]">{profile.rank}</span>
          </motion.div>
        )}

        <motion.p {...rise(0.5)} className="mt-[1vw] hidden text-[max(.95rem,1.25vw)] leading-snug text-white [text-shadow:2px_2px_4px_rgba(0,0,0,.45)] sm:block">
          {profile.synopsis}
        </motion.p>
        <motion.p {...rise(0.5)} className="mt-3 text-sm font-medium text-white/90 sm:hidden">
          {viewer?.pitch ?? profile.tagline}
        </motion.p>

        <motion.div {...rise(0.6)} className="mt-[1.5vw] flex gap-3 pt-3 sm:pt-0">
          <button
            onClick={onPlay}
            className="flex items-center gap-2 whitespace-nowrap rounded-[4px] bg-white px-[max(1.2rem,2.2vw)] py-[max(.5rem,.6vw)] text-[max(1rem,1.3vw)] font-bold text-black transition hover:bg-white/75"
          >
            <Play className="h-[max(1.3rem,1.8vw)] w-[max(1.3rem,1.8vw)]" />
            Play Intro
          </button>
          <button
            onClick={onInfo}
            className="flex items-center gap-2 whitespace-nowrap rounded-[4px] bg-[rgba(109,109,110,.7)] px-[max(1.2rem,2.2vw)] py-[max(.5rem,.6vw)] text-[max(1rem,1.3vw)] font-bold text-white transition hover:bg-[rgba(109,109,110,.4)]"
          >
            <Info className="h-[max(1.3rem,1.8vw)] w-[max(1.3rem,1.8vw)]" />
            More Info
          </button>
          <button
            onClick={onResume}
            className="hidden items-center gap-2 whitespace-nowrap rounded-[4px] border border-white/40 px-[max(1rem,1.6vw)] py-[max(.5rem,.6vw)] text-[max(.9rem,1.1vw)] font-bold text-white transition hover:border-white hover:bg-white/10 sm:flex"
          >
            View Résumé
          </button>
        </motion.div>
      </motion.div>

      {/* rating flag at the right edge */}
      <div className="absolute bottom-[22%] right-0 z-10 hidden border-l-[3px] border-[#dcdcdc] bg-[rgba(51,51,51,.6)] py-[.5vw] pl-[.8vw] pr-[3.5vw] text-[max(.8rem,1.1vw)] text-white md:block">
        {profile.rating}
      </div>
    </section>
  );
}

/** The small red TOP 10 badge. */
export function TopTen({ className = "h-[max(2rem,2.5vw)] w-[max(1.75rem,2.2vw)]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 30" className={`${className} shrink-0`} aria-label="Top 10">
      <rect width="28" height="30" rx="2" fill="var(--accent)" />
      <text x="14" y="11" textAnchor="middle" fill="#fff" fontSize="7.5" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing=".4">
        TOP
      </text>
      <text x="14" y="25" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-.6">
        10
      </text>
    </svg>
  );
}
