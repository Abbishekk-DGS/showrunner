import { motion, useReducedMotion } from "framer-motion";
import config from "../config/portfolio";
import { asset } from "../lib/util";
import { Mail } from "./icons";
import { SectionHead } from "./Reveal";

/* The résumé as a designed sheet: it slides up into view, and can be
   printed or saved as a PDF (only the sheet prints). */
export default function FullStory() {
  const c = config;
  const reduce = useReducedMotion();
  const block = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, delay: i * 0.08 },
  });
  const h = "mb-3 border-b border-white/10 pb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-accent";

  return (
    <section id="story" className="relative mb-[5vw] scroll-mt-20">
      <SectionHead
        id="story"
        aside={
          <div className="flex flex-wrap gap-2">
            {c.profile.resume && (
              <a href={asset(c.profile.resume)} download className="rounded bg-white px-4 py-2 text-sm font-bold text-black hover:bg-white/80">
                Download PDF
              </a>
            )}
            <button onClick={() => window.print()} className="rounded bg-[rgba(109,109,110,.7)] px-4 py-2 text-sm font-bold text-white hover:bg-[rgba(109,109,110,.4)]">
              Print / Save as PDF
            </button>
          </div>
        }
      />
      <motion.article
        id="story-sheet"
        className="mx-[4%] overflow-hidden rounded-md bg-[#1b1b1b] ring-1 ring-white/10"
        initial={reduce ? false : { opacity: 0, y: 80, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1400 }}
      >
        <header className="relative overflow-hidden border-b border-white/10 px-[5%] py-8">
          <div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_100%_0%,color-mix(in_oklab,var(--accent)_25%,transparent),transparent_60%)]" />
          <p className="relative text-[11px] font-bold uppercase tracking-[0.35em] text-white/50">Written, directed and built by</p>
          <h3 className="relative mt-1 font-display text-[clamp(2.4rem,5vw,4.4rem)] uppercase leading-[0.9] text-white">{c.profile.name}</h3>
          <p className="relative mt-2 text-sm font-semibold text-white/80">{c.profile.role}</p>
          <p className="relative mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/60">
            <a href={`mailto:${c.profile.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <Mail className="h-4 w-4" />
              {c.profile.email}
            </a>
            <span>{c.profile.location}</span>
            {c.profile.socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="hover:text-white">
                {s.label} ↗
              </a>
            ))}
          </p>
        </header>

        <div className="grid gap-10 px-[5%] py-8 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-9">
            <motion.section {...block(0)}>
              <h4 className={h}>Summary</h4>
              <p className="text-[15px] leading-relaxed text-white/85">{c.profile.synopsis}</p>
            </motion.section>
            {c.experience.length > 0 && <motion.section {...block(1)}>
              <h4 className={h}>Experience</h4>
              <ol className="space-y-5">
                {c.experience.map((r) => (
                  <li key={r.title + r.dates} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                    <span className="text-xs font-semibold tabular-nums text-white/45">{r.dates}</span>
                    <span>
                      <span className="block font-bold text-white">
                        {r.title} <span className="font-normal text-white/50">· {r.kind}</span>
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-white/70">{r.summary}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </motion.section>}
            {c.publications.length > 0 && <motion.section {...block(2)}>
              <h4 className={h}>{c.publications.length > 1 ? "Publications" : "Publication"}</h4>
              {c.publications.map((p) => (
                <div key={p.title} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <span className="text-xs font-semibold text-white/45">{p.date}</span>
                  <span>
                    <span className="block font-bold leading-snug text-white">{p.title}</span>
                    <span className="mt-0.5 block text-sm italic text-white/60">{p.venue}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/70">{p.note}</span>
                  </span>
                </div>
              ))}
            </motion.section>}
            {c.education.length > 0 && <motion.section {...block(3)}>
              <h4 className={h}>Education</h4>
              <ol className="space-y-4">
                {c.education.map((e) => (
                  <li key={e.degree} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                    <span className="text-xs font-semibold text-white/45">{e.years}</span>
                    <span>
                      <span className="block font-bold text-white">{e.degree}</span>
                      <span className="block text-sm italic text-white/60">{e.school}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </motion.section>}
          </div>

          <div className="space-y-9">
            {c.awards.length > 0 && <motion.section {...block(1)}>
              <h4 className={h}>Awards</h4>
              <ul className="space-y-3">
                {c.awards.map((a) => (
                  <li key={a.title} className="flex gap-3">
                    <span className="grid h-9 w-11 shrink-0 place-items-center rounded bg-accent/15 font-display text-lg text-accent">{a.place}</span>
                    <span>
                      <span className="block text-sm font-bold text-white">{a.title}</span>
                      <span className="block text-xs text-white/55">
                        {a.event} · {a.date}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.section>}
            {c.credentials.length > 0 && <motion.section {...block(2)}>
              <h4 className={h}>Certificates</h4>
              <ul className="space-y-2 text-sm">
                {c.credentials.map((x) => (
                  <li key={x.title}>
                    <span className="font-semibold text-white">{x.title}</span>
                    <span className="text-white/50"> · {x.issuer}</span>
                  </li>
                ))}
              </ul>
            </motion.section>}
            {c.skills.length > 0 && <motion.section {...block(3)}>
              <h4 className={h}>Skills</h4>
              <dl className="space-y-2 text-sm">
                {c.skills.slice(0, 6).map((g) => (
                  <div key={g.name}>
                    <dt className="inline font-bold text-white">{g.name} — </dt>
                    <dd className="inline text-white/65">{g.skills.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </motion.section>}
          </div>
        </div>
      </motion.article>
    </section>
  );
}
