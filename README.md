# Product Catalog

A responsive product listing page with search, filters, sorting and pagination,
built on the free [DummyJSON](https://dummyjson.com/docs/products) products API.

**Live:** _coming soon_

## Features

- Search by title, brand, category or tag (multi-word, case- and accent-insensitive)
- Filter by category, price range, minimum rating and stock
- Sort by price, rating or name; numbered pagination
- Every option lives in the URL, so results are shareable and the back button works
- Active-filter chips with one-click removal and "Clear all"
- Sidebar filters on desktop, slide-over filter panel on mobile
- Light and dark theme
- Loading skeletons, empty state and error state

## Stack

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4,
shadcn/ui (Radix), zod, Vitest.

## How it works

DummyJSON can't search within a category, has no price filter, and rate-limits
bursts of requests. So instead of calling it for every keystroke, the server
fetches the whole catalog (~200 products) once, caches it for an hour, and
filters, sorts and paginates it itself.

```
URL ?q=…&category=…  →  parseProductQuery()  →  getProductPage()  →  server-rendered grid
                                                   │
                                     fetchProductCatalog()  ('use cache' + fetch cache, 1h)
```

- The page shell (header, skeleton) is prerendered; results stream in.
- Filter controls are small client components. They update the URL in a
  React transition with optimistic state, so the UI responds instantly while
  the new results load.
- `getProductPage()` is the only entry point for listing data. If the catalog
  outgrows in-memory filtering, that one function changes to query a real
  search backend.

## Project structure

```
src/
  app/                         page, layout, error and not-found routes
  components/                  site-wide components (header, theme toggle)
  components/ui/               shadcn/ui primitives
  features/products/
    api/                       data access: DummyJSON adapter, page and facet queries
    lib/                       pure logic: query parsing, filtering, facets, formatting (+ tests)
    hooks/                     client hooks (URL query state)
    components/                listing UI; filters/ holds each filter control
    types.ts
```

## Getting started

```bash
pnpm install
pnpm dev         # http://localhost:3000
```

| Script           | What it does                 |
| ---------------- | ---------------------------- |
| `pnpm dev`       | Start the dev server         |
| `pnpm build`     | Production build             |
| `pnpm start`     | Serve the production build   |
| `pnpm test`      | Run unit tests (Vitest)      |
| `pnpm lint`      | Lint with ESLint             |
| `pnpm typecheck` | Type-check with `tsc`        |

No environment variables or API keys are needed.
