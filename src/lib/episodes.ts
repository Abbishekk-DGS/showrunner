import config from "../config/portfolio";
import type { Episode } from "../config/types";
import { hash } from "./util";

export interface Placed {
  episode: Episode;
  /** "S1:E2" */
  code: string;
  seasonIndex: number;
  number: number;
  /** The green "% Match" figure. */
  match: number;
}

const base = config.profile.match ?? 97;

export const allEpisodes: Placed[] = config.seasons.flatMap((s, si) =>
  s.episodes.map((episode, ei) => ({
    episode,
    code: `S${si + 1}:E${ei + 1}`,
    seasonIndex: si,
    number: ei + 1,
    match: episode.match ?? Math.min(99, base - (hash(episode.slug) % 6) + 2),
  })),
);
