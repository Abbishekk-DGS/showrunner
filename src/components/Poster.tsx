import config from "../config/portfolio";
import type { Episode } from "../config/types";
import { asset, hash } from "../lib/util";

/* Cover art for an episode. With an `image` it shows the image; without one
   it draws a poster from the episode's slug, so every card looks finished
   before you have screenshots. */
/* Cinematic two-tone grades; each episode gets one by its slug. */
const PALETTES: [string, string][] = [
  ["#e8743b", "#1d5c6b"],
  ["#3d7bd9", "#1a1f4f"],
  ["#d6283a", "#4a0d16"],
  ["#9b5de5", "#2a1052"],
  ["#e0a63a", "#5a2a0c"],
  ["#2bb39a", "#0f3b3a"],
];

export default function Poster({
  episode,
  label,
  showTitle = true,
  className = "",
}: {
  episode: Episode;
  label?: string;
  showTitle?: boolean;
  className?: string;
}) {
  const h = hash(episode.slug);
  const variant = h % 4;
  const gx = 20 + (h % 60);
  const gy = 15 + ((h >>> 8) % 50);
  const id = `p${h.toString(36)}`;
  const [from, to] = PALETTES[(h >>> 4) % PALETTES.length];

  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      {episode.image ? (
        <img
          src={asset(episode.image)}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 320 180"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <radialGradient id={`${id}g`} cx={`${gx}%`} cy={`${gy}%`} r="75%">
              <stop offset="0" stopColor={from} stopOpacity=".95" />
              <stop offset=".5" stopColor={to} stopOpacity=".45" />
              <stop offset="1" stopColor="#0b0b0b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="#101010" />
          <rect width="320" height="180" fill={`url(#${id}g)`} />
          <g fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth=".8">
            {variant === 0 &&
              // rotor sweep
              Array.from({ length: 9 }, (_, i) => (
                <circle key={i} cx={gx * 3.2} cy={gy * 1.8} r={14 + i * 16} />
              ))}
            {variant === 1 &&
              // terrain contours
              Array.from({ length: 10 }, (_, i) => (
                <path
                  key={i}
                  d={`M-10 ${40 + i * 15} C 80 ${10 + i * 15 + (h % 30)}, 200 ${70 + i * 12}, 330 ${30 + i * 15}`}
                />
              ))}
            {variant === 2 && (
              // survey grid with a target
              <>
                {Array.from({ length: 11 }, (_, i) => (
                  <line key={`v${i}`} x1={i * 32} y1="0" x2={i * 32} y2="180" />
                ))}
                {Array.from({ length: 7 }, (_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 30} x2="320" y2={i * 30} />
                ))}
                <circle cx={gx * 3.2} cy={gy * 1.8} r="18" strokeOpacity=".6" />
                <circle cx={gx * 3.2} cy={gy * 1.8} r="3" fill="#fff" stroke="none" />
              </>
            )}
            {variant === 3 &&
              // light bars
              Array.from({ length: 14 }, (_, i) => (
                <line key={i} x1={i * 28 - 60} y1="190" x2={i * 28 + 40} y2="-10" />
              ))}
          </g>
        </svg>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <span className="absolute left-[5%] top-[6%] font-display text-[max(1rem,1.5vw)] leading-none text-accent [text-shadow:0_1px_4px_rgba(0,0,0,.6)]">
        {config.profile.studio.slice(0, 1)}
      </span>
      {showTitle && (
        <div className="absolute inset-x-[5%] bottom-[9%]">
          {label && (
            <p className="text-[max(.55rem,.6vw)] font-bold uppercase tracking-[0.25em] text-white/70">{label}</p>
          )}
          <p className="font-display text-[max(1.05rem,1.55vw)] uppercase leading-[0.92] tracking-[0.01em] text-white [text-shadow:0_2px_6px_rgba(0,0,0,.5)]">
            {episode.title}
          </p>
        </div>
      )}
      {showTitle && episode.badge && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[3px] bg-accent px-[.6em] py-[.2em] text-[max(.55rem,.65vw)] font-bold text-white">
          {episode.badge}
        </span>
      )}
    </div>
  );
}
