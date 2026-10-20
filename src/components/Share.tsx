import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/** Copies a link straight to this episode (or the series), or opens the
 *  phone's share sheet where there is one. */
export default function Share({ slug, title }: { slug?: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = new URL(window.location.href);
    url.hash = "";
    if (slug) url.searchParams.set("ep", slug);
    else url.searchParams.delete("ep");
    const href = url.toString();
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title, url: href });
        return;
      }
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* the share sheet was dismissed */
    }
  };

  return (
    <div className="relative">
      <button
        onClick={share}
        className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/50 bg-[rgba(42,42,42,.6)] text-white transition hover:border-white"
        aria-label="Share"
        title="Share"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
        </svg>
      </button>
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="absolute left-1/2 top-12 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2.5 py-1 text-xs font-bold text-black"
          >
            Link copied
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
