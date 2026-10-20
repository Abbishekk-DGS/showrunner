import { motion, useReducedMotion } from "framer-motion";
import config from "../config/portfolio";
import { Play, Social } from "./icons";

/* The ending: "To be continued…" burns in letter by letter over a red
   glow, then the name, the role, and the ways to get in touch. */
export default function ToBeContinued({ onReplay }: { onReplay: () => void }) {
  const { outro, profile } = config;
  const reduce = useReducedMotion();
  return (
    <section id="the-end" className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-[4%] py-24 text-center">
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(50% 45% at 50% 55%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)" }}
        initial={reduce ? false : { opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
      />
      <p className="relative text-xs font-bold uppercase tracking-[0.5em] text-accent">{outro.kicker}</p>
      <h2 className="relative mt-3 font-display text-[clamp(3.6rem,11vw,10rem)] uppercase leading-[0.85] text-white" aria-label={outro.title}>
        {outro.title.split("").map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block whitespace-pre [text-shadow:0_0_50px_rgba(229,9,20,.45)]"
            initial={reduce ? false : { opacity: 0, filter: "blur(16px)", y: 30 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch}
          </motion.span>
        ))}
      </h2>
      <motion.div
        className="relative"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.7 }}
      >
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.4em] text-white">{profile.name}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">{profile.role}</p>
        <p className="mx-auto mt-5 max-w-lg text-white/75">{outro.sub}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${profile.email}?subject=${encodeURIComponent("Let's build")}`} className="flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-bold text-white shadow-[0_0_40px_rgba(229,9,20,.5)] transition hover:scale-105">
            <Play className="h-4 w-4" /> {outro.cta}
          </a>
          {profile.socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white">
              <Social label={s.label} className="h-4 w-4" /> {s.label}
            </a>
          ))}
        </div>
        <button onClick={onReplay} className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-white/50 transition hover:text-white">
          ↺ Watch again from the beginning
        </button>
      </motion.div>
    </section>
  );
}
