# apps/web

Phase 1 foundation for the Luthor website using Astro + Starlight + React.

## What this app includes

1. Shared marketing layout with sticky nav:
   - `Documentation` (`/docs`)
   - `Demo` (`/demo`)
   - `GitHub` (external)
2. Odyssey-style CSS foundation in `src/styles/global.css`:
   - Typography: Inter + Lexend
   - Palette: Slate / Zinc / Indigo tokens
   - Shared spacing scale and reusable UI primitives
3. Starlight docs site served under `/docs` using the `docs` content collection.
4. Documentation mirror pipeline from root `documentation/` into `src/content/docs/docs/reference/`.

## Scripts

- `npm run sync:docs`: mirror root docs into Starlight content directory.
- `npm run dev`: run docs sync, then start Astro dev server.
- `npm run build`: run docs sync, then build production output.

## Notes

- Tailwind is intentionally not used in this app.
- Docs search is provided by Starlight Pagefind during build.
