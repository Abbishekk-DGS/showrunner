# Contributing

Thanks for wanting to make Showrunner better. Bug fixes, accessibility
improvements, new optional sections and new backdrops are all welcome.

## Ground rules

- **Content stays in the config.** Components read from
  `src/config/portfolio.ts`; nothing personal is hard-coded in a component.
  A new feature gets a new config field, with a comment in `types.ts`.
- **New things are optional.** A new section or effect must be switchable
  off, and the site must still look finished without it.
- **Respect reduced motion.** Anything that moves must calm down under
  `prefers-reduced-motion`.
- **Keep it light.** Ask in an issue before adding a dependency.
- **No real streaming-service assets.** The layout can feel like a streaming
  app, but no one else's logos, names, fonts or sounds.

## Workflow

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks and builds
```

1. Fork and branch from `main`.
2. Keep the pull request focused on one change and describe what it fixes.
3. Add a screenshot for anything visual (desktop and phone width).
4. Make sure `npm run build` passes.
