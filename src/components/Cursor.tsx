import { useEffect, useRef, useState } from "react";

/* A red dot that follows the pointer exactly, and a ring that trails it and
   swells over anything clickable. Mouse and trackpad only. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setOn(true);
    document.documentElement.classList.add("custom-cursor");

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    let big = false;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      big = !!t.closest("a, button, select, input, [role=button], label");
    };
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px) scale(${big ? 1.8 : 1})`;
        ring.current.style.opacity = big ? "0.9" : "0.5";
      }
      raf = requestAnimationFrame(tick);
    };
    const leave = () => { x = y = -100; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  if (!on) return null;
  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[90] -ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-accent transition-[opacity,scale] duration-200" aria-hidden />
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[91] -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" aria-hidden />
    </>
  );
}
