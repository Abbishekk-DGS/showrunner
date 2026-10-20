import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import About from "./components/About";
import Billboard from "./components/Billboard";
import ContinueExploring from "./components/ContinueExploring";
import Cursor from "./components/Cursor";
import DetailModal, { type Target } from "./components/DetailModal";
import EpisodeCard, { type CardActions } from "./components/EpisodeCard";
import Footer from "./components/Footer";
import FullStory from "./components/FullStory";
import { EpisodeGrid, ExploreAll } from "./components/Grid";
import Journey from "./components/Journey";
import Navbar from "./components/Navbar";
import Opening from "./components/Opening";
import Originals from "./components/Originals";
import Rail from "./components/Rail";
import Reviews from "./components/Reviews";
import ScrollFX from "./components/ScrollFX";
import SkillUniverse from "./components/SkillUniverse";
import ToBeContinued from "./components/ToBeContinued";
import TopMoments from "./components/TopMoments";
import TopPicks from "./components/TopPicks";
import Trailer from "./components/Trailer";
import WhoIsWatching from "./components/WhoIsWatching";
import config from "./config/portfolio";
import type { SectionId, Viewer } from "./config/types";
import { allEpisodes, type Placed } from "./lib/episodes";
import { prepareFades } from "./lib/fade";
import { scrollToTarget, useSmoothScroll } from "./lib/scroll";
import { search, searchSkills, useMyList, useNotices, useWatched, type Notice } from "./lib/state";
import { store } from "./lib/util";

const VIEWER_KEY = "showrunner:viewer";
const INTRO_KEY = "showrunner:intro";

const reducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const params = new URLSearchParams(window.location.search);
const bySlug = (slug: string | null) => allEpisodes.find((p) => p.episode.slug === slug) ?? null;
const mainViewer = config.viewers.find((v) => v.main) ?? config.viewers[0];
// paint the faded copies of the photo while the opening plays
if (config.profile.portrait) prepareFades(import.meta.env.BASE_URL + config.profile.portrait.replace(/^\//, ""));

export default function App() {
  useSmoothScroll(config.theme.smoothScroll);

  // ?for=recruiter opens the site as that viewer, so you can send
  // tailored links. Otherwise use the last profile picked here.
  const [viewer, setViewer] = useState<Viewer | null>(() => {
    const wanted = params.get("for") ?? store.get(VIEWER_KEY);
    return config.viewers.find((v) => v.id === wanted) ?? null;
  });
  // ?ep=<slug> is a shared link to one project: skip the opening and open it
  const linked = bySlug(params.get("ep"));
  const [opening, setOpening] = useState(
    () => config.intro.enabled && !linked && !params.get("for") && !store.get(INTRO_KEY, true),
  );
  const [picking, setPicking] = useState(() => config.intro.askWhoIsWatching && !viewer && !linked);
  const [trailer, setTrailer] = useState(false);
  const [target, setTarget] = useState<Target | null>(() => (linked ? { kind: "episode", placed: linked } : null));
  const [query, setQuery] = useState("");
  const [explore, setExplore] = useState<{ title: string; items: Placed[] } | null>(null);

  const myList = useMyList();
  const { watched, add: addWatched, remove: removeWatched } = useWatched();
  const { notices, unread, markRead } = useNotices();

  const endOpening = useCallback(() => {
    store.set(INTRO_KEY, "1", true);
    setOpening(false);
  }, []);

  const pick = (v: Viewer) => {
    store.set(VIEWER_KEY, v.id);
    setViewer(v);
    setPicking(false);
    setQuery("");
    window.scrollTo({ top: 0 });
  };

  const replay = () => {
    window.scrollTo({ top: 0 });
    if (!reducedMotion) setOpening(true);
    setPicking(config.intro.askWhoIsWatching);
  };

  const openEpisode = useCallback((p: Placed) => setTarget({ kind: "episode", placed: p }), []);
  const closeDetail = useCallback(() => setTarget(null), []);

  // keep the address bar pointing at the open project, so it can be shared
  useEffect(() => {
    const url = new URL(window.location.href);
    if (target?.kind === "episode") url.searchParams.set("ep", target.placed.episode.slug);
    else url.searchParams.delete("ep");
    window.history.replaceState(null, "", url);
  }, [target]);

  // "watching": time spent on a project's detail view fills its progress bar
  useEffect(() => {
    if (target?.kind !== "episode") return;
    const slug = target.placed.episode.slug;
    addWatched(slug, 0.06);
    const t = window.setInterval(() => addWatched(slug, 0.04), 1000);
    return () => window.clearInterval(t);
  }, [target, addWatched]);

  const actions: CardActions = useMemo(
    () => ({ onOpen: openEpisode, saved: myList.has, onToggleSave: myList.toggle }),
    [openEpisode, myList.has, myList.toggle],
  );

  const onNotice = (n: Notice) => {
    if (n.slug) {
      const p = bySlug(n.slug);
      if (p) openEpisode(p);
    } else if (n.id === "trailer") setTrailer(true);
    else if (n.section) scrollToTarget(n.section);
  };

  const order = (viewer ?? mainViewer).order;
  const listed = myList.list.map(bySlug).filter((p): p is Placed => !!p);
  const continuing = Object.entries(watched)
    .filter(([, w]) => w.p < 1)
    .sort((a, b) => b[1].t - a[1].t)
    .map(([slug, w]) => ({ p: bySlug(slug), progress: w.p }))
    .filter((x): x is { p: Placed; progress: number } => !!x.p);

  const episodeRow = (id: string | undefined, title: string, items: Placed[]) => (
    <Rail key={title} id={id} title={title} onExplore={() => setExplore({ title, items })}>
      {items.map((p) => (
        <EpisodeCard key={p.episode.slug} placed={p} actions={actions} />
      ))}
    </Rail>
  );

  const sections: Record<SectionId, ReactNode> = {
    story: <FullStory />,
    moments: <TopMoments />,
    skills: <SkillUniverse onOpen={openEpisode} />,
    originals: <Originals onOpen={openEpisode} />,
    about: <About />,
    journey: <Journey />,
    picks: <TopPicks onOpen={openEpisode} />,
    seasons: (
      <div id="seasons" className="scroll-mt-20">
        {config.seasons.map((s, i) => episodeRow(undefined, `${s.title}: ${s.name}`, allEpisodes.filter((p) => p.seasonIndex === i)))}
      </div>
    ),
    reviews: <Reviews id="reviews" />,
  };

  const results = query.trim() ? search(query) : null;
  const skillHits = query.trim() ? searchSkills(query) : [];

  return (
    <MotionConfig reducedMotion="user">
      {config.theme.cursor && <Cursor />}
      <AnimatePresence>{opening && <Opening key="opening" onDone={endOpening} />}</AnimatePresence>
      <AnimatePresence>{!opening && picking && <WhoIsWatching key="who" onPick={pick} />}</AnimatePresence>

      <ScrollFX />
      <Navbar
        order={order}
        viewer={viewer}
        onPick={pick}
        onExit={() => setPicking(true)}
        query={query}
        onQuery={(q) => {
          if (q && !query) window.scrollTo({ top: 0 });
          setQuery(q);
        }}
        notices={notices}
        unread={unread}
        onReadNotices={markRead}
        onNotice={onNotice}
      />

      <main>
        {results ? (
          // search replaces the page, the way streaming apps do it
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gutter min-h-[80vh] pb-16 pt-28">
            {skillHits.length > 0 && (
              <p className="mb-6 text-[15px] text-[#808080]">
                Explore skills related to:{" "}
                {skillHits.map((g, i) => (
                  <span key={g.name}>
                    {i > 0 && <span className="mx-2 text-[#555]">|</span>}
                    <span className="text-white">{g.name}</span>
                    <span className="text-[#808080]"> ({g.skills.slice(0, 4).join(", ")})</span>
                  </span>
                ))}
              </p>
            )}
            {results.length ? (
              <EpisodeGrid items={results} actions={actions} />
            ) : (
              <div className="mx-auto max-w-md pt-[8vh] text-[15px] text-white/90">
                <p>Your search for "{query}" did not have any matching projects.</p>
                <p className="mt-4">Suggestions:</p>
                <ul className="mt-2 list-disc space-y-1 pl-8">
                  <li>Try a tag, like {allEpisodes.slice(0, 3).map((p) => `"${p.episode.tags[0]}"`).join(", ")}</li>
                  <li>Try a season, like {config.seasons.slice(0, 2).map((s) => `"${s.name.toLowerCase()}"`).join(" or ")}</li>
                  <li>
                    Or just{" "}
                    <a className="underline" href={`mailto:${config.profile.email}?subject=${encodeURIComponent(query)}`}>
                      ask about it
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </motion.div>
        ) : (
          <>
            <Billboard
              viewer={viewer}
              onPlay={() => setTrailer(true)}
              onInfo={() => setTarget({ kind: "series" })}
              onResume={() => scrollToTarget("story")}
            />
            <div className="relative z-10 -mt-[6vw] md:-mt-[8vw]">
              <ContinueExploring order={order} title={`Continue Exploring for ${viewer?.name ?? mainViewer.name}`} />
              {continuing.length > 0 && (
                <Rail title="Continue Watching">
                  {continuing.map(({ p, progress }) => (
                    <EpisodeCard key={p.episode.slug} placed={p} actions={actions} progress={progress} onRemove={() => removeWatched(p.episode.slug)} />
                  ))}
                </Rail>
              )}
              {listed.length > 0 && episodeRow("my-list", "My List", listed)}
              {order.map((id) => (
                <div key={id}>{sections[id]}</div>
              ))}
            </div>
            <ToBeContinued onReplay={replay} />
          </>
        )}
      </main>
      <Footer />

      <Trailer open={trailer} onClose={() => setTrailer(false)} />
      <DetailModal
        target={target}
        onClose={closeDetail}
        onPlay={() => {
          setTarget(null);
          setTrailer(true);
        }}
        actions={actions}
      />
      <ExploreAll title={explore?.title ?? null} items={explore?.items ?? []} actions={actions} onClose={() => setExplore(null)} />
    </MotionConfig>
  );
}
