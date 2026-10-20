import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "./icons";

/* One row: a title, then a horizontal slider. Swipe on touch; with a mouse,
   hover the edges for arrows and see the page markers top right. */
export default function Rail({
  id,
  title,
  children,
  onExplore,
}: {
  id?: string;
  title: string;
  children: ReactNode;
  /** Shows "Explore All" beside the title and opens a full grid. */
  onExplore?: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      setPages(Math.max(1, Math.ceil((el.scrollWidth - 1) / el.clientWidth)));
      setPage(Math.round(el.scrollLeft / el.clientWidth));
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.92, behavior: "smooth" });
  };

  const arrow =
    "absolute inset-y-2 z-10 hidden w-[4%] items-center justify-center bg-[rgba(20,20,20,.5)] text-white opacity-0 transition hover:bg-[rgba(20,20,20,.7)] group-hover/row:opacity-100 [@media(pointer:fine)]:flex";

  return (
    <motion.section
      id={id}
      className="group/row relative mb-[3vw] scroll-mt-20"
      aria-label={title}
      initial={reduce ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="gutter flex items-end justify-between">
        <h2 className="text-[max(1.05rem,1.4vw)] font-bold leading-tight text-[#e5e5e5]">
          {onExplore ? (
            <button onClick={onExplore} className="group/title flex items-baseline gap-2 text-left">
              {title}
              <span className="inline-flex items-center text-[max(.7rem,.9vw)] font-semibold text-[#54b9c5] transition-all duration-500 [@media(pointer:fine)]:-translate-x-2 [@media(pointer:fine)]:opacity-0 [@media(pointer:fine)]:group-hover/title:translate-x-0 [@media(pointer:fine)]:group-hover/title:opacity-100">
                Explore All <ChevronRight className="h-3 w-3" />
              </span>
            </button>
          ) : (
            title
          )}
        </h2>
        {pages > 1 && (
          <ul className="hidden gap-[2px] opacity-0 transition group-hover/row:opacity-100 [@media(pointer:fine)]:flex" aria-hidden>
            {Array.from({ length: pages }, (_, n) => (
              <li key={n} className={`h-[2px] w-3 ${n === page ? "bg-[#aaa]" : "bg-[#4d4d4d]"}`} />
            ))}
          </ul>
        )}
      </div>

      {/* clip so the slide-in offset never widens the page */}
      <div className="relative overflow-x-clip">
        {page > 0 && (
          <button className={`${arrow} left-0 rounded-r`} onClick={() => go(-1)} aria-label={`Scroll ${title} left`}>
            <ChevronLeft className="h-8 w-8 transition hover:scale-125" />
          </button>
        )}
        <motion.div
          ref={ref}
          role="list"
          className="no-scrollbar gutter flex snap-x snap-mandatory gap-[0.4vw] overflow-x-auto scroll-px-[4%] py-2 [@media(pointer:coarse)]:gap-2"
          initial={reduce ? false : { x: 80 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {children}
        </motion.div>
        {page < pages - 1 && (
          <button className={`${arrow} right-0 rounded-l`} onClick={() => go(1)} aria-label={`Scroll ${title} right`}>
            <ChevronRight className="h-8 w-8 transition hover:scale-125" />
          </button>
        )}
      </div>
    </motion.section>
  );
}
