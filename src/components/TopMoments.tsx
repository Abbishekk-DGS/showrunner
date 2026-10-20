import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import config from "../config/portfolio";
import { hash } from "../lib/util";
import Rail from "./Rail";
import { SectionHead } from "./Reveal";

/* Awards as gold-laurel posters that flip over for the details, then a
   rail of every credential. */
export default function TopMoments() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const { awards, credentials } = config;
  if (!awards.length && !credentials.length) return null;

  return (
    <section id="moments" className="relative mb-[4vw] scroll-mt-20">
      <SectionHead id="moments" aside={<p className="text-sm text-white/50">{awards.length} moments · hover or tap to turn over</p>} />
      {awards.length > 0 && <div className="gutter grid grid-cols-2 gap-[0.6vw] sm:grid-cols-3 lg:grid-cols-5 [@media(pointer:coarse)]:gap-2">
        {awards.map((a, i) => {
          const flipped = open === i;
          return (
            <motion.div
              key={a.title}
              className="[perspective:1200px]"
              initial={reduce ? false : { opacity: 0, y: 50, rotateY: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => setOpen(flipped ? null : i)}
                onMouseLeave={() => flipped && setOpen(null)}
                aria-expanded={flipped}
                aria-label={`${a.place}: ${a.title}, ${a.event}, ${a.date}`}
                className="group relative block aspect-[3/4] w-full text-left [transform-style:preserve-3d]"
              >
                <span className={`absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d] [@media(hover:hover)]:group-hover:[transform:rotateY(180deg)] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
                  <span className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[4px] bg-[radial-gradient(120%_80%_at_50%_0%,#3d2c10,#121212_72%)] px-[8%] text-center ring-1 ring-[#d4af37]/30 [backface-visibility:hidden]">
                    <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,230,160,.12)_45%,transparent_60%)] bg-[length:250%_100%] bg-[position:100%_0] transition-[background-position] duration-1000 group-hover:bg-[position:0_0]" />
                    <Laurel place={a.place} />
                    <span className="text-[max(.55rem,.6vw)] font-bold uppercase tracking-[0.3em] text-[#d4af37]">{a.date}</span>
                    <span className="mt-1 font-display text-[max(1.4rem,1.7vw)] uppercase leading-[0.92] text-white">{a.title}</span>
                    <span className="mt-1.5 text-[max(.62rem,.7vw)] leading-snug text-white/60">{a.event}</span>
                  </span>
                  <span className="absolute inset-0 flex flex-col justify-center rounded-[4px] bg-[#232323] p-[10%] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <span className="font-display text-[max(2rem,3vw)] leading-none text-accent">{a.place}</span>
                    <span className="mt-2 text-[max(.85rem,1vw)] font-bold leading-tight text-white">{a.title}</span>
                    <span className="mt-2 text-[max(.72rem,.8vw)] leading-snug text-white/75">{a.detail ?? a.event}</span>
                    <span className="mt-3 text-[max(.62rem,.7vw)] text-white/45">{a.event} · {a.date}</span>
                  </span>
                </span>
              </button>
            </motion.div>
          );
        })}
      </div>}

      {credentials.length > 0 && <div className="mt-[3vw]">
        <Rail title={`Certified · ${credentials.length} credentials`}>
          {credentials.map((c, i) => {
            const hue = ["#e50914", "#1e9bd7", "#e8743b", "#2bb39a", "#9b5de5", "#e0a63a"][hash(c.issuer) % 6];
            const Tag = c.link ? "a" : "div";
            return (
              <motion.div
                role="listitem"
                key={c.title}
                className="row-card shrink-0 snap-start"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Tag
                  {...(c.link ? { href: c.link, target: "_blank", rel: "noreferrer" } : {})}
                  className="flex h-full min-h-[7.5rem] flex-col justify-between rounded-[4px] bg-[#1f1f1f] p-4 ring-1 ring-white/5 transition hover:-translate-y-1 hover:bg-[#262626]"
                >
                  <span className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded font-display text-sm text-white" style={{ background: hue }}>
                      {c.issuer.slice(0, 1)}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">{c.issuer}</span>
                  </span>
                  <span className="mt-3 text-sm font-bold leading-snug text-white">{c.title}</span>
                </Tag>
              </motion.div>
            );
          })}
        </Rail>
      </div>}
    </section>
  );
}

/** Gold laurel wreath with the placing in the middle. */
function Laurel({ place }: { place: string }) {
  const leaves = Array.from({ length: 7 }, (_, i) => i);
  const branch = (flip: boolean) => (
    <g transform={flip ? "translate(120 0) scale(-1 1)" : undefined}>
      <path d="M52 92 C 26 80, 16 50, 30 18" fill="none" stroke="url(#gold)" strokeWidth="2" strokeLinecap="round" />
      {leaves.map((i) => {
        const t = i / 6;
        const a = Math.PI * (0.62 + t * 0.5);
        const x = 60 + 40 * Math.cos(a);
        const y = 60 - 40 * Math.sin(a);
        return <ellipse key={i} cx={x} cy={y} rx="8.5" ry="3.4" fill="url(#gold)" opacity={0.95 - t * 0.3} transform={`rotate(${-70 + t * 95} ${x} ${y})`} />;
      })}
    </g>
  );
  const word = place.length > 3;
  return (
    <svg viewBox="0 0 120 100" className="pointer-events-none mb-[5%] w-[62%]" aria-hidden>
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e09a" />
          <stop offset="1" stopColor="#a8822a" />
        </linearGradient>
      </defs>
      {branch(false)}
      {branch(true)}
      <text x="60" y={word ? 62 : 64} textAnchor="middle" fill="url(#gold)" fontFamily="Bebas Neue, Impact, sans-serif" fontSize={word ? 20 : 30}>
        {place}
      </text>
    </svg>
  );
}
