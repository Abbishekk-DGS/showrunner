/* ================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT.

   Everything below is SAMPLE CONTENT for a made-up person, "Alex
   Morgan". Replace it with your own: every word, colour and section
   on the site comes from here. Types live in ./types.ts, so your
   editor will tell you if something is missing or misspelt.

   Tip: to drop a section, remove its id from every viewer's `order`.
   Empty lists (no awards yet, no reviews yet) hide their section.
   ================================================================ */

import type { PortfolioConfig } from "./types";

const config: PortfolioConfig = {
  /* ---------------------------------------------------------------
     Look and feel
     --------------------------------------------------------------- */
  theme: {
    accent: "#E50914",
    accentDeep: "#B20710",
    ink: "#141414",
    surface: "#181818",
    // `body` and `serif` can be installed font stacks; only the families
    // listed in `load` are fetched from Google Fonts.
    fonts: {
      display: "Bebas Neue",
      body: '"Helvetica Neue", Helvetica, Arial',
      serif: "Instrument Serif",
      load: ["Bebas Neue", "Instrument Serif:ital@0;1"],
    },
    // An optional animated layer over the billboard: "flightpath", "grid" or "none".
    backdrop: "none",
    cursor: true,
    smoothScroll: true,
  },

  /* ---------------------------------------------------------------
     You
     --------------------------------------------------------------- */
  profile: {
    name: "Alex Morgan",
    // its first letter is the small mark above titles
    studio: "Morgan",
    // the red wordmark at the top left
    logo: "Alex",
    seriesLabel: "Series",
    title: ["Alex", "Morgan"],
    // how many letters of the first title line get the red gradient
    highlight: 2,
    role: "Full-Stack · Machine Learning · Design",
    tagline: "Ship it. Measure it. Make it better.",
    synopsis:
      "A full-stack engineer who builds fast web products and the machine-learning features inside them, from the first sketch to the production dashboard.",
    year: "2026",
    rating: "Open to work",
    match: 98,
    // the red TOP 10 badge on the billboard; delete this line to hide it
    rank: "#1 in Engineering Today",
    badges: ["3 Hackathon Wins", "Published", "6 Credentials"],
    genres: ["Full-Stack", "Machine Learning", "Product Design"],
    email: "you@example.com",
    location: "Your City",
    // A tall photo (about 9:16) in /public. This one is a placeholder.
    portrait: "media/portrait.webp",
    // optional ~640px-wide copy for phones; delete if you don't have one
    portraitSmall: "media/portrait-640.webp",
    // resume: "resume.pdf",   ← put a PDF in /public to add a download button
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
      { label: "GitHub", href: "https://github.com/" },
      { label: "Instagram", href: "https://www.instagram.com/" },
    ],
    url: "https://example.com",
  },

  intro: {
    enabled: true,
    askWhoIsWatching: true,
  },

  /* ---------------------------------------------------------------
     "Who's watching?" Each viewer sees the sections in their own order.
     Share a link like yoursite.com/?for=recruiter to skip the picker.
     --------------------------------------------------------------- */
  viewers: [
    {
      id: "me",
      name: "Alex",
      subtitle: "The full series, in order",
      color: "#E50914",
      // uses your photo for the tile and marks it MAIN
      main: true,
      pitch: "The full series, from the first commit",
      order: ["story", "moments", "skills", "originals", "about", "journey", "picks", "seasons", "reviews"],
    },
    {
      id: "recruiter",
      name: "Recruiter",
      subtitle: "Résumé, awards and skills first",
      color: "#2a9db5",
      pitch: "Strong match for engineering roles",
      order: ["story", "moments", "skills", "journey", "originals", "picks", "about", "seasons", "reviews"],
    },
    {
      id: "engineer",
      name: "Engineer",
      subtitle: "Builds, stack and systems first",
      color: "#3aa86a",
      pitch: "Because you like how things are built",
      order: ["originals", "skills", "seasons", "picks", "moments", "journey", "story", "about", "reviews"],
    },
    {
      id: "client",
      name: "Client",
      subtitle: "Work, reviews and results first",
      color: "#e6b422",
      pitch: "Recommended for your next project",
      order: ["originals", "reviews", "picks", "seasons", "moments", "about", "skills", "journey", "story"],
    },
  ],

  sections: {
    story: { kicker: "The Screenplay", title: "The Full Story", nav: "Résumé" },
    moments: { kicker: "Award Season", title: "Top Moments", nav: "Awards" },
    skills: { kicker: "Behind the Scenes", title: "My Skill Universe", nav: "Skills" },
    originals: { kicker: "Now Streaming", title: "Originals", nav: "Projects" },
    about: { kicker: "The Pilot", title: "About Me", nav: "About" },
    journey: { kicker: "3 Seasons", title: "My Journey", nav: "Journey" },
    picks: { kicker: "Most Watched", title: "Alex's Top Picks", nav: "Top Picks" },
    seasons: { kicker: "Every Episode", title: "All Seasons", nav: "Seasons" },
    reviews: { kicker: "The Reviews Are In", title: "Critically Acclaimed", nav: "Reviews" },
  },

  /* ---------------------------------------------------------------
     ▶ Play Intro — the trailer. Keep each slide to one idea.
     --------------------------------------------------------------- */
  trailer: [
    { kicker: "Coming in", title: "One engineer. Every layer.", body: "Interfaces people enjoy, APIs that hold up, and models that earn their place." },
    { kicker: "The flagship", title: "A search that understands.", body: "Semantic search for a support team: answers in seconds instead of minutes." },
    { kicker: "Award season", title: "Three wins.", body: "Hackathons won by shipping something real in a weekend." },
    { kicker: "The standard", title: "Shipped, measured, improved.", body: "Every project ends with numbers, not adjectives." },
  ],

  /* ---------------------------------------------------------------
     Projects, grouped into seasons. Each season becomes a row; every
     episode also appears in Originals. Add `image: "media/x.jpg"` for a
     real screenshot, `links` for buttons, `badge` for a ribbon.
     --------------------------------------------------------------- */
  seasons: [
    {
      id: "web",
      title: "Season 1",
      name: "Web Products",
      subtitle: "Full-stack apps, from database to pixels",
      episodes: [
        {
          slug: "team-dashboard",
          title: "Realtime Team Dashboard",
          logline: "Everyone's work, live, on one screen.",
          details: "A realtime dashboard for a 40-person team: live presence, task boards and a weekly digest. Built with React, Node and Postgres, with websockets for live updates.",
          tags: ["React", "Node.js", "Postgres", "WebSockets"],
          meta: "Flagship",
          badge: "New",
          match: 99,
          links: [{ label: "Live demo", href: "https://example.com" }],
        },
        {
          slug: "booking-platform",
          title: "Booking Platform",
          logline: "Appointments without the phone calls.",
          details: "Online booking for small studios: calendars, reminders and payments, with an admin view for the owner.",
          tags: ["Next.js", "Stripe", "Prisma"],
          meta: "Client work",
        },
        {
          slug: "design-system",
          title: "Component Library",
          logline: "One set of parts for every screen.",
          details: "An accessible component library with tokens, docs and visual tests, used across three products.",
          tags: ["TypeScript", "Storybook", "Accessibility"],
          meta: "Open source",
        },
      ],
    },
    {
      id: "ml",
      title: "Season 2",
      name: "Machine Learning",
      subtitle: "Models that ship inside products",
      episodes: [
        {
          slug: "semantic-search",
          title: "Semantic Support Search",
          logline: "Ask in plain words, get the right answer.",
          details: "Embedding-based search over a support knowledge base, with re-ranking and feedback buttons that improve results over time.",
          tags: ["Python", "Embeddings", "FastAPI"],
          meta: "ML",
          badge: "Published",
        },
        {
          slug: "image-classifier",
          title: "Product Image Tagger",
          logline: "Photos in, tags out.",
          details: "A vision model that tags catalogue photos automatically, trained on a labelled set and served behind a small API.",
          tags: ["PyTorch", "Computer vision", "Docker"],
          meta: "ML",
        },
        {
          slug: "forecasting",
          title: "Demand Forecasting",
          logline: "Know what sells before it does.",
          details: "Weekly demand forecasts for an online shop, with a dashboard that shows confidence ranges.",
          tags: ["pandas", "scikit-learn", "Dashboards"],
          meta: "Data",
        },
      ],
    },
    {
      id: "side",
      title: "Season 3",
      name: "Side Projects",
      subtitle: "Weekend builds and experiments",
      episodes: [
        {
          slug: "habit-tracker",
          title: "Habit Tracker",
          logline: "Small streaks, big results.",
          details: "A mobile-first habit tracker that works offline and syncs when it can.",
          tags: ["PWA", "IndexedDB"],
          meta: "Mobile",
        },
        {
          slug: "cli-tool",
          title: "Deploy CLI",
          logline: "One command to ship.",
          details: "A small command-line tool that builds, tests and deploys a project in one step.",
          tags: ["Go", "CLI"],
          meta: "Tooling",
        },
      ],
    },
  ],

  /* ---------------------------------------------------------------
     The Full Story: your résumé, laid out as a page.
     --------------------------------------------------------------- */
  education: [
    { years: "2020 – 2024", degree: "B.Sc. Computer Science", school: "Your University" },
    { years: "2018 – 2020", degree: "High School", school: "Your School" },
  ],

  experience: [
    { dates: "2024 – Present", title: "Software Engineer", kind: "Full-time", summary: "Builds product features end to end, from API design to the UI." },
    { dates: "Summer 2023", title: "ML Engineering Intern", kind: "Internship", summary: "Shipped a search-ranking experiment that reached production." },
    { dates: "2022 – 2023", title: "Freelance Developer", kind: "Freelance", summary: "Websites and small web apps for local businesses." },
  ],

  publications: [
    {
      date: "2024",
      title: "A Sample Paper Title About Your Research",
      venue: "Conference or Journal Name",
      note: "One line on what the paper found. Delete this entry if you have no publications.",
    },
  ],

  /* ---------------------------------------------------------------
     Top Moments: awards, shown as posters. `place` can be "1st",
     "2nd", "3rd" or a short word such as "Finalist".
     --------------------------------------------------------------- */
  awards: [
    { place: "1st", title: "Campus Hackathon", event: "Your University", date: "2024", detail: "Won by building a working prototype in 36 hours." },
    { place: "2nd", title: "City Startup Weekend", event: "Organiser Name", date: "2023", detail: "Second place for a product pitch and demo." },
    { place: "3rd", title: "Data Challenge", event: "Online", date: "2023", detail: "Third place out of many teams." },
    { place: "Finalist", title: "Design Award", event: "Organiser Name", date: "2022", detail: "Shortlisted for interface design." },
  ],

  credentials: [
    { title: "Cloud Practitioner", issuer: "Cloud Provider", link: "https://example.com" },
    { title: "Machine Learning Specialization", issuer: "Online Course" },
    { title: "Accessibility Fundamentals", issuer: "Online Course" },
    { title: "Data Analysis with Python", issuer: "Online Course" },
    { title: "Scrum Fundamentals", issuer: "Certifying Body" },
    { title: "Security Basics", issuer: "Online Course" },
  ],

  /* ---------------------------------------------------------------
     My Skill Universe. `seenIn` links a group to the projects that use it.
     --------------------------------------------------------------- */
  skills: [
    { name: "Frontend", tagline: "Interfaces people enjoy", skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Accessibility"], seenIn: ["team-dashboard", "design-system"] },
    { name: "Backend", tagline: "APIs that hold up", skills: ["Node.js", "Go", "Postgres", "Redis", "REST & GraphQL"], seenIn: ["booking-platform", "cli-tool"] },
    { name: "Machine Learning", tagline: "Models that earn their place", skills: ["Python", "PyTorch", "scikit-learn", "Embeddings", "FastAPI"], seenIn: ["semantic-search", "image-classifier", "forecasting"] },
    { name: "Cloud & Tools", tagline: "Shipping, safely", skills: ["Docker", "CI/CD", "Linux", "Git", "Observability"] },
    { name: "Design", tagline: "From sketch to system", skills: ["Figma", "Prototyping", "Design systems", "User research"], seenIn: ["design-system"] },
    { name: "People", tagline: "How the work gets done", skills: ["English", "Mentoring", "Writing", "Public speaking"] },
  ],

  about: {
    quote: "Good software is a series: every episode should leave people wanting the next one.",
    facts: [
      { label: "Based in", value: "Your City" },
      { label: "Studied", value: "Computer Science" },
      { label: "Focus", value: "Web + ML" },
      { label: "Shipped", value: "8 projects" },
      { label: "Won", value: "3 hackathons" },
      { label: "Open to", value: "New roles" },
    ],
  },

  /* ---------------------------------------------------------------
     My Journey, told in seasons.
     --------------------------------------------------------------- */
  journey: [
    {
      label: "Season 01",
      title: "The Beginning",
      years: "2018 – 2020",
      summary: "The first website, the first bug, the first fix.",
      episodes: [
        { tag: "2018", title: "Hello, world", body: "Built a first website for a school club." },
        { tag: "2019", title: "First hackathon", body: "Didn't win, learned everything." },
      ],
    },
    {
      label: "Season 02",
      title: "Learning to Ship",
      years: "2020 – 2023",
      summary: "University, freelance work, and the first wins.",
      episodes: [
        { tag: "2020", title: "Computer Science", body: "Started a degree in Computer Science." },
        { tag: "2022", title: "Freelance", body: "Websites and apps for local businesses." },
        { tag: "2023", title: "ML internship", body: "A search-ranking experiment that reached production." },
      ],
    },
    {
      label: "Season 03",
      title: "In Production",
      years: "2024 – Now",
      summary: "Full-time engineering, and what comes next.",
      episodes: [
        { tag: "2024", title: "Software Engineer", body: "Building product features end to end." },
        { tag: "2024", title: "Hackathon win", body: "First place at the campus hackathon." },
        { tag: "Now", title: "Next episode", body: "Open to new roles and collaborations." },
      ],
    },
  ],

  topPicks: ["team-dashboard", "semantic-search", "booking-platform", "image-classifier", "design-system"],

  /* ---------------------------------------------------------------
     Reviews: use real words from real people, with their permission.
     These are placeholders.
     --------------------------------------------------------------- */
  reviews: [
    { quote: "Replace this with a short, real quote from a manager, client or teammate.", name: "Their Name", role: "Their role, Company" },
    { quote: "Two or three sentences work best. Ask before you publish anyone's words.", name: "Their Name", role: "Their role, Company" },
    { quote: "Delete all reviews to hide the Critically Acclaimed row.", name: "Their Name", role: "Their role, Company" },
  ],

  /* The ending. */
  outro: {
    kicker: "Next season",
    title: "To be continued…",
    sub: "The next episode is yours. Tell me what you're building.",
    cta: "Let's build",
  },

  /* Small grey links in the footer, under the social icons. */
  footerLinks: [
    { label: "Email", href: "mailto:you@example.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
};

export default config;
