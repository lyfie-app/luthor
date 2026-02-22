# apps/web

Next.js App Router website for Luthor marketing, demo, and documentation.

## What this app includes

1. SEO-focused landing page at `/` with:
   - Structured data (`SoftwareApplication` and `SoftwareSourceCode`)
   - Build-time package credibility metrics
   - Crawlable semantic content and canonical metadata
2. Live demo page at `/demo/` using the extensive editor preset.
3. Markdown documentation pages under `/docs/**` rendered from:
   - `src/content/docs/docs/*.md`
   - `src/content/docs/docs/reference/**/*.md`
4. Generated sitemap at `/sitemap.xml`.
5. LLM discovery artifacts in `public/llms.txt` and `public/llms-full.txt`.

## Scripts

- `npm run sync:docs`: mirror root docs into `src/content/docs/docs/reference/`.
- `npm run sync:metadata`: refresh package metrics in `src/data/package-metadata.json`.
- `npm run sync:llms`: regenerate `public/llms.txt` and `public/llms-full.txt`.
- `npm run dev`: sync content, then run Next dev server.
- `npm run build`: sync content, then run Next production build.
- `npm run preview`: start Next server from the production build.

## Notes

- Tailwind is intentionally not used in this app.
- Documentation is statically generated and directly indexable by crawlers and bots.
