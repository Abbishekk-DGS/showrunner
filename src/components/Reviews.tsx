import config from "../config/portfolio";
import Rail from "./Rail";

export default function Reviews({ id }: { id: string }) {
  if (!config.reviews.length) return null;
  return (
    <Rail id={id} title={config.sections.reviews.title}>
      {config.reviews.map((r) => (
        <figure
          role="listitem"
          key={r.name}
          className="row-card-wide flex shrink-0 snap-start flex-col justify-between rounded-[4px] bg-[#1f1f1f] p-5 transition duration-300 hover:-translate-y-1 hover:bg-[#262626]"
        >
          <blockquote>
            <span className="flex gap-0.5 text-accent" aria-label="Recommended">
              {"★★★★★"}
            </span>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">“{r.quote}”</p>
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-accent text-sm font-bold text-white" aria-hidden>
              {r.name.slice(0, 1)}
            </span>
            <span>
              <span className="block text-sm font-bold text-white">{r.name}</span>
              <span className="block text-xs text-[#999]">{r.role}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </Rail>
  );
}
