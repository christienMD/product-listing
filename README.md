# Product Catalog

A responsive product listing page with search, filters and product details, built
on the free [DummyJSON](https://dummyjson.com/docs/products) products API.

- **Live demo:** https://product-listing-one-gules.vercel.app
- **Repository:** https://github.com/christienMD/product-listing

## Features

- Search by name, brand, category or tag
- Filter by category, price range, rating and stock; sort by price, rating or name
- Pagination; every search and filter is kept in the URL, so links can be shared
- Product details page with image gallery, specifications and reviews
- Responsive layout (filter panel on mobile), light and dark theme

## Getting started

**Requirements:** [Node.js](https://nodejs.org) 20.9+ and pnpm (run `corepack enable` to get pnpm).

```bash
git clone https://github.com/christienMD/product-listing.git
cd product-listing
pnpm install
pnpm dev
```

Open http://localhost:3000. You don't need API keys or a `.env` file.

| Command                 | What it does                                  |
| ----------------------- | --------------------------------------------- |
| `pnpm dev`              | Start the development server                  |
| `pnpm build`            | Create a production build                     |
| `pnpm start`            | Serve the production build                    |
| `pnpm test`             | Run the unit tests                            |
| `pnpm lint`             | Lint the code                                 |
| `pnpm typecheck`        | Check TypeScript types                        |
| `pnpm snapshot:catalog` | Refresh the bundled fallback copy of the catalog |

## Tech stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui · zod · Vitest · Vercel

## How it works

- **One cached catalog.** DummyJSON can't search inside a category and has no
  price filter, so the server loads the whole catalog (~200 products) in one
  request, caches it for an hour, and does the search, filtering, sorting and
  paging itself.
- **Always loads.** DummyJSON limits how many requests can come from one IP
  address. Failed requests are retried, and if the API is still unavailable
  the app serves a copy of the catalog bundled with the code, so the page
  never shows an error because of the API.
- **URL as state.** Filters update the URL. The server renders the matching
  results, and the controls update instantly while those results load.
- **Static where possible.** The listing's layout is prerendered and results
  stream in; all product pages are prerendered at build time.

```
src/
  app/                    routes: listing (/), product details (/products/[id]), error, 404
  components/             site-wide components and shadcn/ui primitives
  features/products/
    api/                  data loading (DummyJSON adapter, listing and details queries)
    lib/                  search, filter, sort, URL and retry logic (unit tested)
    components/           listing, filters and details UI
    data/                 bundled fallback copy of the catalog
```
