import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { SectionId } from "../config/types";
import config from "../config/portfolio";

/** Words that rise out of a blur, one after another, when scrolled into view. */
export function BlurWords({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={reduce ? false : { opacity: 0, y: "0.35em", filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

/** The red kicker, the big title, and an optional line on the right. */
export function SectionHead({ id, aside, className = "" }: { id: SectionId; aside?: ReactNode; className?: string }) {
  const { kicker, title } = config.sections[id];
  const reduce = useReducedMotion();
  return (
    <div className={`gutter mb-[2vw] flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        <motion.p
          className="flex items-center gap-2 text-[max(.65rem,.75vw)] font-bold uppercase tracking-[0.35em] text-accent"
          initial={reduce ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="h-px w-6 bg-accent" />
          {kicker}
        </motion.p>
        <h2 className="mt-1 font-display text-[max(2.6rem,5vw)] uppercase leading-[0.9] text-white">
          <BlurWords text={title} />
        </h2>
      </div>
      {aside}
    </div>
  );
}
