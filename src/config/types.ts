/* The shape of portfolio.ts. You shouldn't need to edit this file to
   customise the site — it exists so your editor can autocomplete and
   type-check the config. */

/** The sections that each viewer can reorder. The opening, the billboard
 *  and the Continue Exploring row always come first; "To be continued…"
 *  and the footer always close the page. */
export type SectionId =
  | "story"
  | "moments"
  | "skills"
  | "originals"
  | "about"
  | "journey"
  | "picks"
  | "seasons"
  | "reviews";

export interface Theme {
  /** Brand colour: highlights, progress bars, badges. */
  accent: string;
  /** A deeper shade of the accent, for gradients. */
  accentDeep: string;
  /** Page background. */
  ink: string;
  /** Cards and panels. */
  surface: string;
  /** Font stacks for titles, body text and quotes. Families in `load` are
   *  fetched from Google Fonts. */
  fonts: { display: string; body: string; serif: string; load: string[] };
  /** An optional animated layer over the billboard. */
  backdrop: "flightpath" | "grid" | "none";
  /** The red dot-and-ring cursor (mouse and trackpad only). */
  cursor: boolean;
  /** Lenis smooth scrolling. */
  smoothScroll: boolean;
}

export interface Link {
  label: string;
  href: string;
}

export interface Profile {
  /** Full name, used in the page title and the footer. */
  name: string;
  /** Its first letter is the small mark above titles. */
  studio: string;
  /** The red wordmark in the nav. */
  logo: string;
  /** The word beside the studio letter above the title, e.g. "Series". */
  seriesLabel: string;
  /** The big title treatment. Each item is one line. */
  title: string[];
  /** How many letters of the first title line get the red gradient. */
  highlight?: number;
  /** A short line under the title, e.g. "Full-Stack · Machine Learning · Design". */
  role: string;
  tagline: string;
  /** Two or three sentences, like the blurb under a show's title. */
  synopsis: string;
  year: string;
  /** The boxed badge at the right edge of the billboard. */
  rating: string;
  /** The green "% Match" figure in meta rows (0–100). */
  match?: number;
  /** Text beside the TOP 10 badge on the billboard. Leave out to hide it. */
  rank?: string;
  /** Short facts shown as chips in the billboard meta row. */
  badges: string[];
  genres: string[];
  email: string;
  location: string;
  coordinates?: string;
  /** Tall photo (about 9:16) in /public. Used by the opening, the billboard,
   *  the main profile tile and About. */
  portrait?: string;
  /** Optional smaller copy of the photo (about 640px wide) for phones. */
  portraitSmall?: string;
  /** Optional PDF in /public, offered as a download in The Full Story. */
  resume?: string;
  socials: Link[];
  url?: string;
}

export interface Episode {
  /** Unique, URL-safe id. */
  slug: string;
  title: string;
  /** One line, shown on cards and in the episode list. */
  logline: string;
  /** The full story, shown in the detail view. */
  details: string;
  tags: string[];
  /** Overrides the green "% Match" for this episode. */
  match?: number;
  /** Free text in place of a runtime, e.g. "Flagship". */
  meta?: string;
  /** Small ribbon on the card, e.g. "New". */
  badge?: string;
  /** Optional image in /public. Without one, the card gets generated art. */
  image?: string;
  links?: Link[];
}

export interface Season {
  id: string;
  /** "Season 1" */
  title: string;
  /** "Software": the row is titled "Season 1: Software". */
  name: string;
  subtitle: string;
  episodes: Episode[];
}

export interface Education {
  years: string;
  degree: string;
  school: string;
  note?: string;
}

export interface Role {
  dates: string;
  title: string;
  /** "Internship", "Founder"… */
  kind: string;
  summary: string;
}

export interface Publication {
  date: string;
  title: string;
  venue: string;
  note: string;
  link?: string;
}

export interface Award {
  /** "1st", "2nd", "3rd" or a word such as "Speaker". */
  place: string;
  title: string;
  event: string;
  date: string;
  detail?: string;
}

export interface Credential {
  title: string;
  issuer: string;
  link?: string;
}

export interface SkillGroup {
  name: string;
  tagline: string;
  skills: string[];
  /** Episode slugs where these skills show up; listed as links. */
  seenIn?: string[];
}

export interface JourneySeason {
  /** "Season 01" */
  label: string;
  title: string;
  years: string;
  summary: string;
  episodes: { title: string; body: string; tag?: string }[];
}

export interface Review {
  quote: string;
  name: string;
  role: string;
}

export interface TrailerSlide {
  kicker: string;
  title: string;
  body: string;
}

export interface Viewer {
  id: string;
  name: string;
  /** One line under the tile, e.g. "Résumé and achievements first". */
  subtitle: string;
  /** Tile colour. */
  color: string;
  /** Use the portrait as this tile's picture and mark it MAIN. */
  main?: boolean;
  /** Replaces the billboard's highlight line for this viewer. */
  pitch: string;
  /** Which sections appear, and in what order. */
  order: SectionId[];
}

export interface SectionCopy {
  /** Small red line above the heading, e.g. "The Pilot". */
  kicker: string;
  title: string;
  /** Short label for the nav and the Continue Exploring cards. */
  nav: string;
}

export interface PortfolioConfig {
  theme: Theme;
  profile: Profile;
  intro: {
    /** Plays the opening sequence once per browser session. */
    enabled: boolean;
    /** Ask "Who's watching?" after the opening. The choice is remembered. */
    askWhoIsWatching: boolean;
  };
  viewers: Viewer[];
  sections: Record<SectionId, SectionCopy>;
  trailer: TrailerSlide[];
  seasons: Season[];
  education: Education[];
  experience: Role[];
  publications: Publication[];
  awards: Award[];
  credentials: Credential[];
  skills: SkillGroup[];
  about: { quote: string; facts: { label: string; value: string }[] };
  journey: JourneySeason[];
  /** Episode slugs for the Top Picks row, best first. */
  topPicks: string[];
  reviews: Review[];
  outro: { kicker: string; title: string; sub: string; cta: string };
  footerLinks: Link[];
}
