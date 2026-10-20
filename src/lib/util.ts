import { useEffect, useRef } from "react";
import { lockScroll } from "./scroll";

/** Resolves a /public path against the deploy base (needed on GitHub Pages). */
export function asset(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}

/** Storage can throw in private windows or with site data blocked. */
export const store = {
  get(key: string, session = false) {
    try {
      return (session ? sessionStorage : localStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string | null, session = false) {
    try {
      const s = session ? sessionStorage : localStorage;
      if (value === null) s.removeItem(key);
      else s.setItem(key, value);
    } catch {
      /* not critical */
    }
  },
};

/** A stable number from a string, used to vary generated poster art. */
export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** For modals: lock page scroll, close on Escape, keep Tab inside, and
 *  give focus back to whatever opened it. */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    lockScroll(true);
    const frame = requestAnimationFrame(() => ref.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key !== "Tab" || !ref.current) return;
      const items = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      lockScroll(false);
      opener?.focus?.();
    };
  }, [open]);

  return ref;
}
