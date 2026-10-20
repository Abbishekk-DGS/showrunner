import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Placed } from "../lib/episodes";
import { useDialog } from "../lib/util";
import EpisodeCard, { type CardActions } from "./EpisodeCard";
import { Close } from "./icons";

/** A grid of episode cards, used by search results and Explore All. */
export function EpisodeGrid({ items, actions }: { items: Placed[]; actions: CardActions }) {
  return (
    <div className="grid grid-cols-2 gap-x-[0.4vw] gap-y-[4vw] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 [&_.row-card]:w-full">
      {items.map((p, i) => (
        <motion.div key={p.episode.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <EpisodeCard placed={p} actions={actions} />
        </motion.div>
      ))}
    </div>
  );
}

/** Explore All: a full-screen page for one row. */
export function ExploreAll({
  title,
  items,
  actions,
  onClose,
  extra,
}: {
  title: string | null;
  items: Placed[];
  actions: CardActions;
  onClose: () => void;
  extra?: ReactNode;
}) {
  const ref = useDialog(!!title, onClose);
  return (
    <AnimatePresence>
      {title && (
        <motion.div
          ref={ref}
          tabIndex={-1}
          role="dialog"
          aria-modal
          aria-label={title}
          className="fixed inset-0 z-[45] overflow-y-auto bg-ink pt-[68px] outline-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
        >
          <div className="gutter py-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-[max(1.8rem,2.6vw)] font-bold text-white">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]">
                <Close className="h-5 w-5" />
              </button>
            </div>
            {extra}
            <EpisodeGrid items={items} actions={actions} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
