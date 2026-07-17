<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Shopping practice visual assets

- Product and mission images live under `public/images/shopping/`; keep editable originals and prompt records under `design-assets/shopping/`.
- Product photos use a clean, unbranded, light background and a consistent three-quarter view. Lifestyle images may show a home setting but must not imply a real diagnosis or guaranteed safety result.
- Every image needs Korean alt text. Product names, prices and safety guidance remain HTML text, never baked into an image.
- Keep generated product JPG files near 800×800 and below 180 KB when practical; hero JPG files should be below 250 KB. Run `scripts/optimize-shopping-images.ps1` after replacing originals.
- Practice screens must label all products as examples and must not display affiliate links. Affiliate links belong only after the learning result and must retain the required disclosure.
