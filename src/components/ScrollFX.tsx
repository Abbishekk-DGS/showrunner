import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "./icons";

/* A thin progress line under the nav, and a back-to-top button. */
export default function ScrollFX() {
  const { scrollYProgress, scrollY } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [far, setFar] = useState(false);
  useEffect(() => scrollY.on("change", (y) => setFar(y > window.innerHeight * 1.2)), [scrollY]);

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-[41] h-[3px] origin-left bg-accent" style={{ scaleX: width }} aria-hidden />
      <AnimatePresence>
        {far && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-30 grid h-12 w-12 place-items-center rounded-full border-2 border-white/40 bg-[rgba(20,20,20,.8)] text-white backdrop-blur transition hover:border-white"
            aria-label="Back to top"
          >
            <ChevronDown className="h-6 w-6 rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
