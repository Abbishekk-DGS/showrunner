import { useCallback, useEffect, useState } from "react";
import config from "../config/portfolio";
import { allEpisodes } from "./episodes";
import { store } from "./util";

/** A JSON value kept in localStorage, shared across components on this tab. */
function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = store.get(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => store.set(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}

/** My List: episode slugs, newest first. */
export function useMyList() {
  const [list, setList] = useStored<string[]>("showrunner:list", []);
  const toggle = useCallback(
    (slug: string) => setList((l) => (l.includes(slug) ? l.filter((s) => s !== slug) : [slug, ...l])),
    [setList],
  );
  const has = useCallback((slug: string) => list.includes(slug), [list]);
  return { list, toggle, has };
}

/** Continue Watching: how much of each episode has been "watched" (0–1),
 *  which grows with the time spent reading its detail view. */
export function useWatched() {
  const [watched, setWatched] = useStored<Record<string, { p: number; t: number }>>("showrunner:watched", {});
  const add = useCallback(
    (slug: string, amount: number) =>
      setWatched((w) => ({ ...w, [slug]: { p: Math.min(1, (w[slug]?.p ?? 0) + amount), t: Date.now() } })),
    [setWatched],
  );
  const remove = useCallback(
    (slug: string) =>
      setWatched((w) => {
        const { [slug]: _gone, ...rest } = w;
        return rest;
      }),
    [setWatched],
  );
  return { watched, add, remove };
}

export interface Notice {
  id: string;
  kicker: string;
  title: string;
  /** Opens this project… */
  slug?: string;
  /** …or scrolls to this section. */
  section?: string;
}

/** Bell notifications: new episodes, the latest award, the trailer and the ending. */
export function useNotices() {
  const notices: Notice[] = [
    ...allEpisodes
      .filter((p) => p.episode.badge)
      .map((p) => ({ id: p.episode.slug, kicker: p.episode.badge ?? "New", title: p.episode.title, slug: p.episode.slug })),
    ...config.awards.slice(0, 1).map((a) => ({ id: `award-${a.title}`, kicker: `${a.place} place`, title: a.title, section: "moments" })),
    { id: "next-season", kicker: config.outro.kicker, title: "Your project, the next episode", section: "the-end" },
    { id: "trailer", kicker: "Now playing", title: `${config.profile.name}: Official Trailer` },
  ];
  const [seen, setSeen] = useStored<string[]>("showrunner:seen", []);
  const unread = notices.filter((n) => !seen.includes(n.id)).length;
  const markRead = () => setSeen(notices.map((n) => n.id));
  return { notices, unread, markRead };
}

/** Search across episodes: every word must appear somewhere in the episode. */
export function search(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return allEpisodes.filter((p) => {
    const e = p.episode;
    const s = config.seasons[p.seasonIndex];
    const hay = [e.title, e.logline, e.details, e.meta, ...e.tags, s.title, s.name, s.subtitle].join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

/** Skill groups that match a search, so "python" finds something too. */
export function searchSkills(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return config.skills.filter((g) => [g.name, g.tagline, ...g.skills].join(" ").toLowerCase().includes(q));
}
