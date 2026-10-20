import { useReducedMotion } from "framer-motion";
import config from "../config/portfolio";

/* The layer behind the billboard: a drone's flight path being traced over a
   survey grid, with a HUD read-out in the corners. Pick "grid" or "none" in
   the config for something quieter. */
const PATH =
  "M -40 520 C 120 430, 210 610, 360 470 S 560 250, 720 330 S 930 560, 1080 400 S 1260 160, 1500 220";

export default function Backdrop() {
  const reduce = useReducedMotion();
  const { backdrop } = config.theme;
  const { coordinates } = config.profile;
  if (backdrop === "none") return <Glow />;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <Glow />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="survey" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="white" strokeOpacity=".045" />
          </pattern>
          <linearGradient id="trail" x1="0" x2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset=".6" stopColor="var(--accent)" stopOpacity=".28" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity=".6" />
          </linearGradient>
          <radialGradient id="dot">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="800" fill="url(#survey)" />

        {backdrop === "flightpath" && (
          <>
            <path id="flight" d={PATH} fill="none" stroke="white" strokeOpacity=".08" strokeDasharray="2 10" />
            <path
              d={PATH}
              fill="none"
              stroke="url(#trail)"
              strokeWidth="1.5"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={reduce ? 0 : 1}
            >
              {!reduce && (
                <animate attributeName="stroke-dashoffset" from="1" to="0" dur="9s" fill="freeze" />
              )}
            </path>
            {/* waypoints */}
            {[
              [360, 470],
              [720, 330],
              [1080, 400],
            ].map(([x, y], i) => (
              <g key={i} stroke="var(--accent)" strokeOpacity=".35" fill="none">
                <circle cx={x} cy={y} r="9" />
                <path d={`M${x - 16} ${y}h7M${x + 9} ${y}h7M${x} ${y - 16}v7M${x} ${y + 9}v7`} />
                <text
                  x={x + 16}
                  y={y - 14}
                  fill="var(--accent)"
                  fillOpacity=".45"
                  stroke="none"
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  letterSpacing="2"
                >
                  WP{i + 1}
                </text>
              </g>
            ))}
            {!reduce && (
              <g>
                <circle r="22" fill="url(#dot)" opacity=".5" />
                <circle r="3.5" fill="var(--accent)" />
                <animateMotion dur="9s" fill="freeze" rotate="auto">
                  <mpath href="#flight" />
                </animateMotion>
              </g>
            )}
          </>
        )}
      </svg>

      {/* HUD corners */}
      <div className="absolute inset-x-4 top-24 hidden justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-accent/50 md:flex md:inset-x-10">
        <span>REC ● {coordinates ?? "Live"}</span>
        <span>ALT 120M · GPS LOCK</span>
      </div>
    </div>
  );
}

function Glow() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div
        className="absolute -inset-[20%] opacity-70 [animation:drift_24s_ease-in-out_infinite_alternate]"
        style={{
          background:
            "radial-gradient(40% 50% at 70% 35%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%), radial-gradient(35% 40% at 15% 80%, color-mix(in oklab, var(--accent-deep) 18%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
