// Refreshes the catalog copy the app falls back to when DummyJSON is unavailable.
// Usage: pnpm snapshot:catalog
import { writeFile } from "node:fs/promises";

const SNAPSHOT_PATH = new URL(
  "../src/features/products/data/product-catalog-snapshot.json",
  import.meta.url,
);

const response = await fetch("https://dummyjson.com/products?limit=0");
if (!response.ok) {
  throw new Error(`DummyJSON request failed: ${response.status} ${response.statusText}`);
}

const { products } = await response.json();

// Drop what the app never shows: `meta`, and reviewer email addresses.
const snapshotProducts = products.map((product) => {
  const snapshotProduct = {
    ...product,
    reviews: product.reviews.map((review) => {
      const snapshotReview = { ...review };
      delete snapshotReview.reviewerEmail;
      return snapshotReview;
    }),
  };
  delete snapshotProduct.meta;
  return snapshotProduct;
});

await writeFile(SNAPSHOT_PATH, `${JSON.stringify({ products: snapshotProducts })}\n`);
console.log(`Saved ${snapshotProducts.length} products to ${SNAPSHOT_PATH.pathname}`);
