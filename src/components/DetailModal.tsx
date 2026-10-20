import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import config from "../config/portfolio";
import { allEpisodes, type Placed } from "../lib/episodes";
import { useFaded } from "../lib/fade";
import { asset, useDialog } from "../lib/util";
import { TopTen } from "./Billboard";
import type { CardActions } from "./EpisodeCard";
import { Check, ChevronDown, Close, Mail, Play, Plus } from "./icons";
import Share from "./Share";
import { Dots, HD, Match, Rating } from "./Meta";
import Poster from "./Poster";

/** What the modal shows: the whole series (from the billboard) or one episode. */
export type Target = { kind: "series" } | { kind: "episode"; placed: Placed };

export default function DetailModal({
  target,
  onClose,
  onPlay,
  actions,
}: {
  target: Target | null;
  onClose: () => void;
  onPlay: () => void;
  actions: CardActions;
}) {
  const ref = useDialog(!!target, onClose);
  const { profile, seasons } = config;
  const faded = useFaded(profile.portrait ? asset(profile.portrait) : null, "left");
  const ep = target?.kind === "episode" ? target.placed : null;
  const [season, setSeason] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setSeason(ep?.seasonIndex ?? 0);
    setShowAll(false);
    ref.current?.scrollTo?.({ top: 0 });
  }, [ep, target, ref]);

  const more = allEpisodes.filter((p) => p.episode.slug !== ep?.episode.slug);
  const shownMore = showAll ? more : more.slice(0, 6);
  const list = allEpisodes.filter((p) => p.seasonIndex === season);
  const totalEpisodes = allEpisodes.length;
  const saved = ep ? actions.saved(ep.episode.slug) : false;
  const link = ep?.episode.links?.[0];

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          ref={ref}
          tabIndex={-1}
          role="dialog"
          aria-modal
          aria-labelledby="detail-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 outline-none sm:pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            key={ep?.episode.slug ?? "series"}
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto min-h-full max-w-[850px] overflow-hidden bg-surface shadow-[0_3px_10px_rgba(0,0,0,.75)] sm:mb-8 sm:min-h-0 sm:rounded-md"
          >
            {/* header art */}
            <div className="relative aspect-video">
              {ep ? (
                <div className="absolute inset-0 [&>div]:h-full">
                  <Poster episode={ep.episode} showTitle={false} />
                </div>
              ) : (
                <>
                  {profile.portrait && (
                    <>
                      <img src={asset(profile.portrait)} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-2xl" />
                      {faded && <img src={faded} alt={profile.name} className="absolute right-0 top-0 h-full w-[60%] object-cover object-[50%_15%]" />}
                    </>
                  )}
                </>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--surface),transparent_50%)]" />
              <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-surface text-white">
                <Close className="h-5 w-5" />
              </button>

              <div className="absolute bottom-[8%] left-[5%] right-[5%]">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#dcdcdc]">
                  <span className="font-display text-2xl leading-none tracking-normal text-accent">{profile.studio.slice(0, 1)}</span>
                  {ep ? `${seasons[ep.seasonIndex].title} · Episode ${ep.number}` : profile.seriesLabel}
                </p>
                <h2 id="detail-title" className="mt-1 max-w-[80%] font-display text-[clamp(2.6rem,7vw,4.5rem)] uppercase leading-[0.85] text-white">
                  {ep ? ep.episode.title : profile.title.join(" ")}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  {ep ? (
                    <a
                      href={link?.href ?? `mailto:${profile.email}?subject=${encodeURIComponent(ep.episode.title)}`}
                      target={link ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-[4px] bg-white px-6 py-2 text-base font-bold text-black transition hover:bg-white/75 sm:px-8"
                    >
                      {link ? <Play className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
                      {link?.label ?? "Ask about this"}
                    </a>
                  ) : (
                    <button onClick={onPlay} className="flex items-center gap-2 rounded-[4px] bg-white px-6 py-2 text-base font-bold text-black transition hover:bg-white/75 sm:px-8">
                      <Play className="h-6 w-6" />
                      Play
                    </button>
                  )}
                  {ep && (
                    <button
                      onClick={() => actions.onToggleSave(ep.episode.slug)}
                      className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/50 bg-[rgba(42,42,42,.6)] text-white transition hover:border-white"
                      aria-label={saved ? "Remove from My List" : "Add to My List"}
                      title={saved ? "Remove from My List" : "Add to My List"}
                    >
                      {saved ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                  )}
                  <Share slug={ep?.episode.slug} title={ep ? ep.episode.title : profile.name} />
                </div>
              </div>
            </div>

            <div className="px-[5%] pb-10">
              {/* info */}
              <div className="grid gap-6 py-4 sm:grid-cols-[2fr_1fr] sm:gap-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[15px] text-[#bcbcbc]">
                    <Match value={ep?.match ?? profile.match ?? 98} />
                    <span>{profile.year}</span>
                    <Rating>{ep ? ep.code : profile.rating}</Rating>
                    <span>{ep ? ep.episode.meta : `${seasons.length} Seasons`}</span>
                    <HD />
                  </div>
                  {!ep && profile.rank && (
                    <p className="mt-3 flex items-center gap-2 text-lg font-bold text-white">
                      <TopTen className="h-7 w-6" />
                      {profile.rank}
                    </p>
                  )}
                  <p className="mt-4 text-[15px] leading-relaxed text-white">
                    {ep ? (
                      <>
                        <span className="font-bold">{ep.episode.logline}</span> {ep.episode.details}
                      </>
                    ) : (
                      profile.synopsis
                    )}
                  </p>
                </div>
                <div className="space-y-3 text-sm text-[#ddd]">
                  <p>
                    <span className="text-[#777]">Cast: </span>
                    {profile.name}
                  </p>
                  <p>
                    <span className="text-[#777]">{ep ? "Tags: " : "Genres: "}</span>
                    {(ep ? ep.episode.tags : profile.genres).join(", ")}
                  </p>
                  <p>
                    <span className="text-[#777]">This show is: </span>
                    {profile.badges.join(", ")}
                  </p>
                </div>
              </div>

              {/* episodes */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-white">Episodes</h3>
                <label className="relative">
                  <span className="sr-only">Season</span>
                  <select
                    value={season}
                    onChange={(e) => setSeason(Number(e.target.value))}
                    className="appearance-none rounded border border-[#4d4d4d] bg-[#242424] py-2 pl-4 pr-10 text-base font-bold text-white"
                  >
                    {seasons.map((s, n) => (
                      <option key={s.id} value={n}>
                        {s.title}: {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                </label>
              </div>
              <p className="mt-2 text-sm text-[#bcbcbc]">
                {seasons[season].title}: <span className="text-white">{seasons[season].subtitle}</span>
              </p>
              <ol className="mt-4">
                {list.map((p) => {
                  const current = p.episode.slug === ep?.episode.slug;
                  return (
                    <li key={p.episode.slug}>
                      <button
                        onClick={() => actions.onOpen(p)}
                        className={`grid w-full grid-cols-[auto_1fr] items-center gap-4 rounded-md border-b border-[#404040] px-2 py-5 text-left transition hover:bg-[#333] sm:grid-cols-[2.5rem_8.5rem_1fr] sm:px-6 ${current ? "bg-[#333]" : ""}`}
                        aria-current={current || undefined}
                      >
                        <span className="hidden text-center text-2xl text-[#d2d2d2] sm:block">{p.number}</span>
                        <Poster episode={p.episode} showTitle={false} className="aspect-video w-28 rounded sm:w-auto" />
                        <span className="min-w-0">
                          <span className="flex justify-between gap-3 text-[15px] font-bold text-white">
                            <span>
                              <span className="sm:hidden">{p.number}. </span>
                              {p.episode.title}
                            </span>
                            <span className="font-normal text-white/80">{p.match}%</span>
                          </span>
                          <span className="mt-1 line-clamp-3 block text-sm leading-snug text-[#d2d2d2]">{p.episode.logline} {p.episode.details}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              {/* more like this */}
              {more.length > 0 && (
                <>
                  <h3 className="mt-10 text-2xl font-bold text-white">More Like This</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    {shownMore.map((p) => {
                      const isSaved = actions.saved(p.episode.slug);
                      return (
                        <div key={p.episode.slug} className="overflow-hidden rounded-[4px] bg-[#2f2f2f]">
                          <button className="block w-full" onClick={() => actions.onOpen(p)} aria-label={`Open ${p.episode.title}`}>
                            <Poster episode={p.episode} label={p.code} className="aspect-video" />
                          </button>
                          <div className="p-3 sm:p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1 text-[13px] text-[#bcbcbc]">
                                <Match value={p.match} />
                                <div className="flex items-center gap-2">
                                  <Rating>{p.code}</Rating>
                                  <span>{p.episode.meta}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => actions.onToggleSave(p.episode.slug)}
                                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-white/50 bg-[rgba(42,42,42,.6)] text-white transition hover:border-white"
                                aria-label={isSaved ? "Remove from My List" : "Add to My List"}
                              >
                                {isSaved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                              </button>
                            </div>
                            <p className="mt-3 text-[13px] leading-snug text-[#d2d2d2]">{p.episode.logline}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {more.length > 6 && (
                    <div className="relative mt-2 flex justify-center border-b-2 border-[#404040]">
                      <button
                        onClick={() => setShowAll((s) => !s)}
                        className="absolute top-0 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-2 border-white/50 bg-[rgba(42,42,42,.6)] text-white hover:border-white"
                        aria-label={showAll ? "Show less" : "Show more"}
                      >
                        <ChevronDown className={`h-5 w-5 transition ${showAll ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* about */}
              <h3 className="mt-12 text-2xl text-white">
                About <span className="font-bold">{profile.name}</span>
              </h3>
              <div className="mt-4 space-y-2 text-sm text-[#ddd]">
                <p><span className="text-[#777]">Creator: </span>{profile.name}</p>
                <p><span className="text-[#777]">Genres: </span>{profile.genres.join(", ")}</p>
                <p><span className="text-[#777]">This show is: </span>{profile.badges.join(", ")}</p>
                <p><span className="text-[#777]">Seasons: </span>{seasons.length} · {totalEpisodes} episodes</p>
                <p><span className="text-[#777]">Filmed in: </span>{profile.location}</p>
                <p className="flex items-center gap-2 pt-1">
                  <span className="text-[#777]">Rating: </span>
                  <Rating>{profile.rating}</Rating>
                  <Dots items={[profile.email]} />
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
