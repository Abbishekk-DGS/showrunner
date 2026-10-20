import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import config from "../config/portfolio";
import { useFaded } from "../lib/fade";
import { asset } from "../lib/util";
import { Play } from "./icons";

/* The opening titles, like the cold open of a series:
   dark → the name burns in through a blur with a red glow → the portrait
   rises behind it → "The Series" and the role line → ▶ Play.
   Play (or Enter) moves on; Skip jumps straight there. */
export default function Opening({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const { profile } = config;
  const name = profile.title[0];
  const [ready, setReady] = useState(!!reduce);
  const spotlight = useFaded(profile.portrait ? asset(profile.portrait) : null, "spotlight");

  useEffect(() => {
    const t = setTimeout(() => setReady(true), reduce ? 0 : 3600);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onDone();
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", key);
    };
  }, [onDone, reduce]);

  const t = (d: number) => (reduce ? 0 : d);

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-hidden bg-black"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      data-lenis-prevent
    >
      {/* the red light that wakes up behind everything */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(45% 55% at 50% 62%, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.9, 0.55], scale: [0.6, 1.1, 1] }}
        transition={{ duration: t(3.2), delay: t(0.4), times: [0, 0.5, 1] }}
      />

      {/* the portrait rising behind the name */}
      {spotlight && (
        <motion.img
          src={spotlight}
          alt=""
          className="absolute bottom-0 left-1/2 h-[80vh] max-w-none -translate-x-1/2 object-contain"
          // opacity, position and scale only: Safari can't animate a filter on this image
          initial={reduce ? false : { opacity: 0, y: 80, scale: 1.06 }}
          animate={{ opacity: 0.9, y: 0, scale: 1 }}
          transition={{ duration: t(1.8), delay: t(1.2), ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50" />

      <div className="absolute inset-x-0 top-[16vh] flex flex-col items-center text-center">
        <h1 className="relative font-display text-[clamp(4.5rem,17vw,15rem)] uppercase leading-[0.85] text-white" aria-label={name}>
          {name.split("").map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block [text-shadow:0_0_40px_rgba(229,9,20,.55),0_8px_40px_rgba(0,0,0,.8)]"
              initial={reduce ? false : { opacity: 0, filter: "blur(18px)", scale: 1.4, y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
              transition={{ duration: t(1.1), delay: t(0.2 + i * 0.07), ease: [0.16, 1, 0.3, 1] }}
            >
              {ch}
            </motion.span>
          ))}
          {/* a light sweep across the letters */}
          {!reduce && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/60 to-transparent mix-blend-overlay"
              initial={{ left: "-30%" }}
              animate={{ left: "120%" }}
              transition={{ duration: 1.4, delay: 1.4, ease: "easeInOut" }}
            />
          )}
        </h1>
        <motion.p
          className="mt-2 text-[max(.75rem,1vw)] font-bold uppercase tracking-[0.6em] text-accent"
          initial={reduce ? false : { opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.6em" }}
          transition={{ duration: t(1.4), delay: t(1.9) }}
        >
          The {profile.seriesLabel}
        </motion.p>
        <motion.p
          className="mt-3 text-[max(.7rem,.85vw)] font-semibold uppercase tracking-[0.3em] text-white/70"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: t(0.8), delay: t(2.5) }}
        >
          {profile.role}
        </motion.p>
      </div>

      <div className="absolute inset-x-0 bottom-[9vh] flex flex-col items-center gap-4">
        <AnimatePresence>
          {ready && (
            <motion.button
              onClick={onDone}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative flex items-center gap-3 rounded-full bg-white px-9 py-3.5 text-lg font-bold text-black shadow-[0_0_60px_rgba(229,9,20,.45)] transition hover:scale-105"
              autoFocus
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-white/30 [animation-duration:2.2s]" aria-hidden />
              <Play className="relative h-6 w-6" />
              <span className="relative">Play</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onDone}
        className="absolute bottom-6 right-6 text-xs font-semibold uppercase tracking-widest text-white/50 transition hover:text-white"
      >
        Skip intro
      </button>
    </motion.div>
  );
}
