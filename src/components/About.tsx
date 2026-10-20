import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import config from "../config/portfolio";
import { asset } from "../lib/util";
import { BlurWords, SectionHead } from "./Reveal";

/* About Me — "The Pilot". The portrait drifts against the scroll, the quote
   writes itself in, and the facts count up underneath. */
export default function About() {
  const { profile, about } = config;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 80, reduce ? 0 : -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.05]);

  return (
    <section id="about" ref={ref} className="relative mb-[5vw] scroll-mt-20 overflow-hidden">
      <SectionHead id="about" />
      <div className="gutter grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        {profile.portrait && (
          <motion.figure style={{ y }} className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-md lg:max-w-none">
            <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_70%,color-mix(in_oklab,var(--accent)_45%,transparent),transparent_70%)]" />
            <motion.img style={{ scale }} src={asset(profile.portrait)} alt={profile.name} className="relative h-full w-full object-cover object-[50%_18%]" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-5">
              <span className="block font-display text-3xl uppercase leading-none text-white">{profile.name}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{profile.role}</span>
            </figcaption>
          </motion.figure>
        )}
        <div>
          <blockquote className="font-serif text-[clamp(1.8rem,3.4vw,3.2rem)] italic leading-[1.15] text-white">
            <span className="text-accent">“</span>
            <BlurWords text={about.quote} />
            <span className="text-accent">”</span>
          </blockquote>
          <motion.p
            className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/75"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {profile.synopsis}
          </motion.p>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-white/10 sm:grid-cols-3">
            {about.facts.map((f, i) => (
              <motion.div
                key={f.label}
                className="bg-ink p-4"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.07 }}
              >
                <dt className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">{f.label}</dt>
                <dd className="mt-1 font-semibold text-white">{f.value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
