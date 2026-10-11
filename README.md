# Product Catalog

A responsive product listing page that pulls live data from the free
[DummyJSON](https://dummyjson.com/docs/products) products API, with search,
filters, sorting and pagination.

**Live demo:** https://product-listing-one-gules.vercel.app

## Features

- **Search** by product name, brand, category or tag
- **Filter** by category, price range, minimum rating and stock
- **Sort** by price, rating or name, with numbered pagination
- **Shareable URLs**: every search and filter is kept in the address bar, so links and the back button work
- **Responsive**: sidebar filters on desktop, a slide-out filter panel on mobile
- Light and dark theme, loading skeletons, and empty and error states

## Run it locally

### 1. Install the requirements

- [Node.js](https://nodejs.org) **20.9 or newer** (check with `node --version`)
- **pnpm**. The easiest way is to turn on Corepack, which comes with Node.js:

  ```bash
  corepack enable
  ```

### 2. Get the code and install dependencies

```bash
git clone https://github.com/christienMD/product-listing.git
cd product-listing
pnpm install
```

### 3. Start the app

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

You don't need API keys or a `.env` file. The app uses a free public API.

### Other commands

| Command          | What it does                                    |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | Start the development server                    |
| `pnpm build`     | Create a production build                       |
| `pnpm start`     | Serve the production build (run `build` first)  |
| `pnpm test`      | Run the unit tests                              |
| `pnpm lint`      | Check the code with ESLint                      |
| `pnpm typecheck` | Check TypeScript types                          |

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui,
zod and Vitest.

## How it works

The DummyJSON API can't search inside a category, has no price filter, and
limits how many requests you can make in a short time. So instead of calling
the API on every keystroke, the server loads the whole catalog (about 200
products) once, caches it for an hour, and does the searching, filtering,
sorting and paging itself.

```
URL (?q=…&category=…)  →  parseProductQuery()  →  getProductPage()  →  product grid
                                                       │
                                         fetchProductCatalog()  (cached for 1 hour)
```

- The page layout loads instantly, and the results stream in right after.
- The filter controls update the URL. They react immediately while the new
  results load in the background.
- `getProductPage()` is the only place listing data comes from. If the catalog
  grows too large to filter in memory, only that function needs to change.

## Project structure

```
src/
  app/                       page, layout, error and 404 pages
  components/                site-wide components (header, theme toggle)
  components/ui/             shadcn/ui building blocks
  features/products/
    api/                     data loading from DummyJSON
    lib/                     search, filter, sort and URL logic (with unit tests)
    hooks/                   client-side URL state
    components/              listing UI; filters/ holds each filter control
    types.ts
```
