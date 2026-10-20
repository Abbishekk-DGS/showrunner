import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Placed } from "../lib/episodes";
import { Check, ChevronDown, Close, Play, Plus } from "./icons";
import { Dots, HD, Match, Rating } from "./Meta";
import Poster from "./Poster";

export interface CardActions {
  onOpen: (p: Placed) => void;
  saved: (slug: string) => boolean;
  onToggleSave: (slug: string) => void;
}

const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* A row card. With a mouse, resting on it for a moment pops up the larger
   preview card above the row; on touch, a tap opens the detail view. */
export default function EpisodeCard({
  placed,
  actions,
  progress,
  onRemove,
}: {
  placed: Placed;
  actions: CardActions;
  /** 0–1: shows a Continue Watching bar under the art. */
  progress?: number;
  onRemove?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const timer = useRef<number>(undefined);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const enter = () => {
    if (!fine()) return;
    timer.current = window.setTimeout(() => ref.current && setRect(ref.current.getBoundingClientRect()), 450);
  };
  const leave = () => window.clearTimeout(timer.current);

  useEffect(() => {
    if (!rect) return;
    const close = () => setRect(null);
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [rect]);

  return (
    <div role="listitem" className="row-card shrink-0 snap-start">
      <button
        ref={ref}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onClick={() => actions.onOpen(placed)}
        className="block w-full overflow-hidden rounded-[4px] text-left"
        aria-label={`${placed.episode.title}: ${placed.episode.logline}`}
      >
        <Poster episode={placed.episode} label={placed.code} className="aspect-video" />
      </button>
      {progress !== undefined && (
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-[3px] flex-1 bg-[#5a5a5a]">
            <div className="h-full bg-accent transition-[width] duration-700" style={{ width: `${Math.max(4, progress * 100)}%` }} />
          </div>
          {onRemove && (
            <button onClick={onRemove} aria-label={`Remove ${placed.episode.title} from Continue Watching`} className="text-white/50 hover:text-white">
              <Close className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
      {createPortal(
        <AnimatePresence>
          {rect && <Preview placed={placed} rect={rect} actions={actions} onClose={() => setRect(null)} />}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

function Preview({
  placed,
  rect,
  actions,
  onClose,
}: {
  placed: Placed;
  rect: DOMRect;
  actions: CardActions;
  onClose: () => void;
}) {
  const vw = document.documentElement.clientWidth;
  const gutter = vw * 0.04;
  const width = Math.min(rect.width * 1.5, vw - gutter * 2);
  const left = Math.max(gutter, Math.min(rect.left + rect.width / 2 - width / 2, vw - gutter - width));
  const imageH = (width * 9) / 16;
  const top = Math.max(8, rect.top + rect.height / 2 - imageH / 2);
  const origin = left === gutter ? "left" : left + width >= vw - gutter - 1 ? "right" : "center";
  const saved = actions.saved(placed.episode.slug);
  const { episode } = placed;

  return (
    <motion.div
      className="fixed z-30 overflow-hidden rounded-md bg-surface shadow-[0_3px_10px_rgba(0,0,0,.75)]"
      style={{ left, top, width, transformOrigin: `${origin} top` }}
      initial={{ opacity: 0, scale: rect.width / width }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: rect.width / width }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onMouseLeave={onClose}
    >
      <button className="block w-full" onClick={() => { onClose(); actions.onOpen(placed); }} aria-label={`Open ${episode.title}`}>
        <Poster episode={episode} label={placed.code} className="aspect-video" />
      </button>
      <div className="space-y-2.5 p-4 text-[13px]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { onClose(); actions.onOpen(placed); }}
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-black transition hover:bg-white/80"
            aria-label="Play"
          >
            <Play className="ml-0.5 h-4 w-4" />
          </button>
          <button
            onClick={() => actions.onToggleSave(episode.slug)}
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/50 bg-[rgba(42,42,42,.6)] text-white transition hover:border-white"
            aria-label={saved ? "Remove from My List" : "Add to My List"}
            title={saved ? "Remove from My List" : "Add to My List"}
          >
            {saved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { onClose(); actions.onOpen(placed); }}
            className="ml-auto grid h-9 w-9 place-items-center rounded-full border-2 border-white/50 bg-[rgba(42,42,42,.6)] text-white transition hover:border-white"
            aria-label="More info"
            title="More info"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Match value={placed.match} />
          <Rating>{placed.code}</Rating>
          {episode.meta && <span className="text-white/80">{episode.meta}</span>}
          <HD />
        </div>
        <div className="text-white">
          <Dots items={episode.tags} />
        </div>
      </div>
    </motion.div>
  );
}
