import Lenis from "lenis";
import { useEffect, useState } from "react";

let lenis: Lenis | null = null;

/** Lenis smooth scrolling for the page; modals opt out with data-lenis-prevent. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.1, anchors: { offset: -70 } });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);
}

/** Scroll to an element or position, smoothly when Lenis is running. */
export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(typeof target === "string" ? `#${target}` : target, { offset: typeof target === "string" ? -70 : 0 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
}

/** Stops page scrolling while a dialog is open. */
export function lockScroll(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

/** How far through each section the visitor has scrolled (0–1), for the
 *  Continue Exploring progress bars. Only ever goes up. */
export function useSectionProgress(ids: string[]) {
  // `key` stands in for `ids`, so a new array with the same ids doesn't re-subscribe
  const [progress, setProgress] = useState<Record<string, number>>({});
  const key = ids.join(",");
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      setProgress((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          const seen = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * 0.4)));
          if (seen > (next[id] ?? 0) + 0.01) {
            next[id] = seen > 0.97 ? 1 : seen;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(measure); };
    window.addEventListener("scroll", on, { passive: true });
    measure();
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, [key]);
  return progress;
}
