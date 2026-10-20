import config from "../config/portfolio";
import type { SectionId } from "../config/types";
import { scrollToTarget, useSectionProgress } from "../lib/scroll";
import { Play } from "./icons";
import Rail from "./Rail";

const ART = [
  ["#7b2ff7", "#1b0b3a"],
  ["#e50914", "#3b0508"],
  ["#1e9bd7", "#082436"],
  ["#e8743b", "#3a1608"],
  ["#2bb39a", "#0b2e29"],
  ["#e0a63a", "#3a2608"],
  ["#c2185b", "#33051a"],
  ["#3d7bd9", "#0c1a3a"],
  ["#9b5de5", "#22103d"],
];

/* "Continue Exploring": one card per section, in this viewer's order, with
   a red bar showing how much of that section they've already scrolled. */
export default function ContinueExploring({ order, title }: { order: SectionId[]; title: string }) {
  const progress = useSectionProgress(order);
  return (
    <Rail title={title}>
      {order.map((id, i) => {
        const s = config.sections[id];
        const [a, b] = ART[i % ART.length];
        const p = progress[id] ?? 0;
        return (
          <div role="listitem" key={id} className="row-card shrink-0 snap-start">
            <button
              onClick={() => scrollToTarget(id)}
              className="group relative block aspect-video w-full overflow-hidden rounded-[4px] text-left"
              style={{ background: `linear-gradient(135deg, ${a}, ${b} 75%)` }}
            >
              <span className="absolute -right-[4%] -top-[12%] font-display text-[9vw] leading-none text-white/10 transition duration-500 group-hover:scale-110 group-hover:text-white/20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute left-[6%] top-[8%] text-[max(.55rem,.6vw)] font-bold uppercase tracking-[0.3em] text-white/80">
                Episode {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute bottom-[14%] left-[6%] right-[6%] font-display text-[max(1.3rem,1.7vw)] uppercase leading-[0.9] text-white">
                {s.title}
              </span>
              <span className="absolute right-[6%] top-[8%] grid h-8 w-8 place-items-center rounded-full border-2 border-white/70 bg-black/40 opacity-0 transition group-hover:opacity-100">
                <Play className="ml-0.5 h-3.5 w-3.5" />
              </span>
              <span className="absolute inset-x-[6%] bottom-[6%] h-[3px] bg-white/30">
                <span className="block h-full bg-accent transition-[width] duration-500" style={{ width: `${Math.round(p * 100)}%` }} />
              </span>
            </button>
          </div>
        );
      })}
    </Rail>
  );
}
