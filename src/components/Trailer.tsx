import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import config from "../config/portfolio";
import { useFaded } from "../lib/fade";
import { asset, useDialog } from "../lib/util";
import { Back, ChevronLeft, ChevronRight, Close, Pause, Play } from "./icons";

const SLIDE_MS = 5500;

/* ▶ Play: the highlight reel, dressed as a video player — back arrow, red
   scrubber, time left, title in the control bar. Arrow keys skip, Space
   pauses, Escape leaves. */
export default function Trailer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const slides = config.trailer;
  const total = slides.length * SLIDE_MS;
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [idle, setIdle] = useState(false);
  const ref = useDialog(open, onClose);
  const idleTimer = useRef<number>(undefined);

  const i = Math.max(0, Math.min(slides.length - 1, Math.floor(elapsed / SLIDE_MS)));
  const jump = useCallback((n: number) => setElapsed(Math.max(0, Math.min(slides.length - 1, n)) * SLIDE_MS), [slides.length]);

  useEffect(() => {
    if (open) {
      setElapsed(0);
      setPaused(false);
    }
  }, [open]);

  // the clock
  useEffect(() => {
    if (!open || paused) return;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      // a frame's timestamp can be a little older than `last`
      setElapsed((e) => e + Math.max(0, now - last));
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, paused]);

  useEffect(() => {
    if (open && elapsed >= total) onClose();
  }, [open, elapsed, total, onClose]);

  // hide the controls after a moment without the mouse moving
  const wake = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2600);
  }, []);
  useEffect(() => {
    if (open) wake();
    return () => window.clearTimeout(idleTimer.current);
  }, [open, wake]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      wake();
      if (e.key === "ArrowRight") jump(i + 1);
      if (e.key === "ArrowLeft") jump(i - 1);
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, i, jump, wake]);

  const slide = slides[i];
  const { portrait, name } = config.profile;
  const faded = useFaded(portrait ? asset(portrait) : null, "left");
  const left = Math.max(0, Math.ceil((total - elapsed) / 1000));
  const show = !idle || paused;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          tabIndex={-1}
          role="dialog"
          aria-modal
          aria-label="Trailer"
          onMouseMove={wake}
          className={`fixed inset-0 z-50 overflow-hidden bg-black outline-none ${show ? "" : "cursor-none"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {faded && (
            <motion.img
              key={`p${i}`}
              src={faded}
              alt=""
              className="absolute inset-y-0 right-0 h-full w-full object-cover object-[50%_20%] opacity-45 md:w-[62%] md:opacity-75"
              initial={{ scale: 1.14, x: i % 2 ? -20 : 20 }}
              animate={{ scale: 1.02, x: 0 }}
              transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />

          <button className="absolute inset-0 z-[1]" aria-label={paused ? "Play" : "Pause"} onClick={() => setPaused((p) => !p)} />

          <div className="pointer-events-none relative z-[2] flex h-full flex-col justify-center px-[6%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl"
              >
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">{slide.kicker}</p>
                <h2 className="mt-3 font-display text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.88]">{slide.title}</h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{slide.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* player chrome */}
          <motion.div animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.3 }} className="pointer-events-none absolute inset-0 z-[3]">
            <button onClick={onClose} aria-label="Back" className="pointer-events-auto absolute left-[3%] top-[4%] text-white transition hover:scale-110">
              <Back className="h-10 w-10" />
            </button>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-[3%] pb-5 pt-16">
              <div className="flex items-center gap-4">
                <div className="group/scrub pointer-events-auto relative h-1 flex-1 cursor-pointer bg-white/30 transition-all hover:h-1.5"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setElapsed(Math.max(0, ((e.clientX - r.left) / r.width) * total));
                  }}
                >
                  {slides.slice(1).map((_, n) => (
                    <span key={n} className="absolute inset-y-0 w-[3px] bg-black/60" style={{ left: `${((n + 1) / slides.length) * 100}%` }} />
                  ))}
                  <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${Math.min(100, (elapsed / total) * 100)}%` }} />
                  <span
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition group-hover/scrub:scale-125"
                    style={{ left: `${Math.min(100, (elapsed / total) * 100)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm tabular-nums text-white/90">
                  0:{String(left).padStart(2, "0")}
                </span>
              </div>

              <div className="pointer-events-auto mt-4 flex items-center gap-6 text-white">
                <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"} className="transition hover:scale-110">
                  {paused ? <Play className="h-9 w-9" /> : <Pause className="h-9 w-9" />}
                </button>
                <button onClick={() => jump(i - 1)} aria-label="Previous" className="transition hover:scale-110 disabled:opacity-30" disabled={i === 0}>
                  <ChevronLeft className="h-9 w-9" />
                </button>
                <button onClick={() => jump(i + 1)} aria-label="Next" className="transition hover:scale-110 disabled:opacity-30" disabled={i === slides.length - 1}>
                  <ChevronRight className="h-9 w-9" />
                </button>
                <p className="mx-auto hidden truncate text-lg sm:block">
                  <span className="font-bold">{name}</span>
                  <span className="ml-3 text-white/70">
                    E{i + 1} {slide.kicker}
                  </span>
                </p>
                <button onClick={onClose} aria-label="Close" className="ml-auto transition hover:scale-110 sm:ml-0">
                  <Close className="h-8 w-8" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
