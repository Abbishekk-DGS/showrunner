import { useEffect, useRef, useState } from "react";
import config from "../config/portfolio";
import type { SectionId, Viewer } from "../config/types";
import type { Notice } from "../lib/state";
import { allEpisodes } from "../lib/episodes";
import { Bell, ChevronDown, Close } from "./icons";
import Poster from "./Poster";
import { Avatar } from "./WhoIsWatching";

export default function Navbar({
  order,
  viewer,
  onPick,
  onExit,
  query,
  onQuery,
  notices,
  unread,
  onReadNotices,
  onNotice,
}: {
  order: SectionId[];
  viewer: Viewer | null;
  onPick: (v: Viewer) => void;
  onExit: () => void;
  query: string;
  onQuery: (q: string) => void;
  notices: Notice[];
  unread: number;
  onReadNotices: () => void;
  onNotice: (n: Notice) => void;
}) {
  const [searching, setSearching] = useState(false);
  const [bell, setBell] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const bellTimer = useRef<number>(undefined);

  // "/" jumps to search
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/input|textarea|select/i.test(t.tagName)) {
        e.preventDefault();
        setSearching(true);
        requestAnimationFrame(() => input.current?.focus());
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (query) setSearching(true);
  }, [query]);

  const openBell = () => {
    window.clearTimeout(bellTimer.current);
    setBell(true);
    onReadNotices();
  };
  const closeBell = () => {
    bellTimer.current = window.setTimeout(() => setBell(false), 250);
  };
  const [solid, setSolid] = useState(false);
  const [browse, setBrowse] = useState(false);
  const [menu, setMenu] = useState(false);
  const closeTimer = useRef<number>(undefined);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const links = [
    { href: "#top", label: "Home" },
    ...order.map((id) => ({ href: `#${id}`, label: config.sections[id].nav })),
    { href: "#the-end", label: "Contact" },
  ];

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setMenu(false), 250);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-[400ms] ${
        solid ? "bg-ink" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <nav className="gutter flex h-[68px] items-center" aria-label="Main">
        <a href="#top" className={`mr-4 shrink-0 font-display text-[1.6rem] uppercase leading-none tracking-[0.02em] text-accent sm:mr-6 sm:text-[2.1rem] lg:mr-10 ${searching ? "max-sm:hidden" : ""}`}>
          {config.profile.logo}
        </a>

        <ul className="hidden items-center gap-5 text-sm text-[#e5e5e5] lg:flex">
          {links.map((l, i) => (
            <li key={l.href}>
              <a href={l.href} className={`transition hover:text-[#b3b3b3] ${i === 0 ? "font-bold text-white" : ""}`}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* phones and tablets: "Browse" menu */}
        <div className={`relative lg:hidden ${searching ? "max-sm:hidden" : ""}`}>
          <button className="flex items-center gap-1 text-sm font-semibold text-white" aria-expanded={browse} onClick={() => setBrowse((o) => !o)}>
            Browse <ChevronDown className="h-4 w-4" />
          </button>
          {browse && (
            <ul className="absolute left-1/2 top-9 w-56 -translate-x-1/2 border-t-2 border-white bg-black/90 py-2 text-center">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setBrowse(false)} className="block py-3 text-sm text-[#b3b3b3] hover:bg-white/5 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ml-auto flex min-w-0 items-center gap-3 text-white sm:gap-5">
          {/* search */}
          <div className={`flex items-center transition-all duration-300 ${searching ? "border border-white bg-black/80" : "border border-transparent"}`}>
            <button
              onClick={() => {
                setSearching(true);
                requestAnimationFrame(() => input.current?.focus());
              }}
              aria-label="Search"
              className="px-1.5 py-1 hover:text-[#b3b3b3]"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m15.5 15.5 5 5" strokeLinecap="round" />
              </svg>
            </button>
            <input
              ref={input}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              onBlur={() => !query && setSearching(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onQuery("");
                  setSearching(false);
                  input.current?.blur();
                }
              }}
              placeholder="Projects, skills, tags"
              aria-label="Search projects"
              className={`bg-transparent text-sm text-white outline-none transition-all duration-300 placeholder:text-[#8c8c8c] ${searching ? "w-[min(42vw,240px)] pr-2" : "w-0"}`}
            />
            {searching && query && (
              <button onClick={() => onQuery("")} aria-label="Clear search" className="pr-2">
                <Close className="h-4 w-4" />
              </button>
            )}
          </div>

          <a href={`mailto:${config.profile.email}`} className="hidden text-sm hover:text-[#b3b3b3] md:block">
            Hire Me
          </a>

          {/* notifications */}
          <div className="relative" onMouseEnter={openBell} onMouseLeave={closeBell}>
            <button
              onClick={() => (bell ? setBell(false) : openBell())}
              aria-label={`Notifications${unread ? `, ${unread} new` : ""}`}
              aria-expanded={bell}
              className="relative block hover:text-[#b3b3b3]"
            >
              <Bell className="h-6 w-6" />
              {unread > 0 && (
                <span className="absolute -right-1.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>
            {bell && (
              <div className="absolute right-[-3rem] top-11 w-[min(88vw,380px)] border-t-2 border-white bg-black/95 text-sm sm:right-0">
                <ul className="max-h-[60vh] divide-y divide-white/10 overflow-y-auto">
                  {notices.map((n) => {
                    const ep = n.slug ? allEpisodes.find((p) => p.episode.slug === n.slug) : null;
                    return (
                      <li key={n.id}>
                        <button
                          onClick={() => {
                            setBell(false);
                            onNotice(n);
                          }}
                          className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/5"
                        >
                          {ep ? (
                            <Poster episode={ep.episode} showTitle={false} className="aspect-video w-28 shrink-0 rounded-sm" />
                          ) : (
                            <span className="grid aspect-video w-28 shrink-0 place-items-center rounded-sm bg-[#2a2a2a] font-display text-3xl text-accent">
                              {config.profile.studio.slice(0, 1)}
                            </span>
                          )}
                          <span>
                            <span className="block text-[#b3b3b3]">{n.kicker}</span>
                            <span className="block text-white">{n.title}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          {viewer && (
            <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
              <button className="flex items-center gap-2" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)}>
                <Avatar viewer={viewer} />
                <span className="sr-only">Profile: {viewer.name}</span>
                <ChevronDown className={`hidden h-4 w-4 transition-transform duration-300 sm:block ${menu ? "rotate-180" : ""}`} />
              </button>
              {menu && (
                <div role="menu" className="absolute right-0 top-12 w-56 border border-white/15 bg-black/90 text-[13px]">
                  <span className="absolute -top-2 right-6 h-0 w-0 border-x-[7px] border-b-[7px] border-x-transparent border-b-white/80" aria-hidden />
                  <ul className="space-y-1 p-3">
                    {config.viewers
                      .filter((v) => v.id !== viewer.id)
                      .map((v) => (
                        <li key={v.id}>
                          <button role="menuitem" onClick={() => { setMenu(false); onPick(v); }} className="flex w-full items-center gap-3 py-1 text-left text-white/90 hover:underline">
                            <Avatar viewer={v} />
                            {v.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                  <button role="menuitem" onClick={() => { setMenu(false); onExit(); }} className="block w-full border-t border-white/15 py-3.5 text-center text-white/90 hover:underline">
                    Switch profiles
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
