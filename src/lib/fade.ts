import { useEffect, useState } from "react";

/* Safari drops an <img> that has a CSS mask once a transform or filter
   animation on it finishes. So instead of masking in CSS, the fades are
   painted into a copy of the photo with a canvas, once, and that copy is
   animated freely. Works for any photo set in the config. */

export type Fade = "left" | "spotlight";
const cache = new Map<string, Promise<string>>();

function paint(src: string, fade: Fade): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("no canvas"));
      ctx.drawImage(img, 0, 0, w, h);
      ctx.globalCompositeOperation = "destination-in";
      if (fade === "left") {
        // transparent at the left edge, solid from 45% across
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(0.18, "rgba(0,0,0,.35)");
        g.addColorStop(0.45, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      } else {
        // an oval spotlight, solid in the middle and gone at the edges
        const rx = w * 0.5;
        const ry = h * 0.56;
        ctx.save();
        ctx.translate(w / 2, h * 0.45);
        ctx.scale(rx / ry, 1);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry);
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(0.55, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(-w, -h, w * 2 * (ry / rx) + w, h * 2);
        ctx.restore();
      }
      c.toBlob((blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error("toBlob failed"))), "image/png");
    };
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

/** The photo with a fade painted in. Null until it's ready; falls back to
 *  the original photo if the canvas can't be used. */
export function useFaded(src: string | null | undefined, fade: Fade) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!src) return;
    let live = true;
    const key = `${fade}:${src}`;
    if (!cache.has(key)) cache.set(key, paint(src, fade));
    cache
      .get(key)!
      .then((u) => live && setUrl(u))
      .catch(() => live && setUrl(src));
    return () => {
      live = false;
    };
  }, [src, fade]);
  return url;
}

/** Start painting early, e.g. while the opening plays. */
export function prepareFades(src: string | null | undefined) {
  if (!src) return;
  for (const fade of ["left", "spotlight"] as Fade[]) {
    const key = `${fade}:${src}`;
    if (!cache.has(key)) cache.set(key, paint(src, fade));
  }
}
