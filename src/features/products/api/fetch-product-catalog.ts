import { cacheLife, cacheTag } from "next/cache";
import { fetchJsonWithRetry } from "@/features/products/lib/fetch-json-with-retry";
import { parseDummyJsonCatalog } from "@/features/products/lib/parse-dummyjson-catalog";
import type { ProductDetails } from "@/features/products/types";

const DUMMYJSON_PRODUCTS_URL = "https://dummyjson.com/products";

// Everything except `meta`, which the app never shows.
const PRODUCT_FIELDS = [
  "title",
  "description",
  "category",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "brand",
  "thumbnail",
  "images",
  "tags",
  "availabilityStatus",
  "sku",
  "weight",
  "dimensions",
  "warrantyInformation",
  "shippingInformation",
  "returnPolicy",
  "minimumOrderQuantity",
  "reviews",
] as const;

const CATALOG_REVALIDATE_SECONDS = 60 * 60;

export const PRODUCT_CATALOG_CACHE_TAG = "product-catalog";

function buildCatalogUrl(): string {
  const url = new URL(DUMMYJSON_PRODUCTS_URL);
  url.searchParams.set("limit", "0");
  url.searchParams.set("select", PRODUCT_FIELDS.join(","));
  return url.toString();
}

async function loadCatalogSnapshot(): Promise<ProductDetails[]> {
  const { default: snapshot } = await import(
    "@/features/products/data/product-catalog-snapshot.json"
  );
  return parseDummyJsonCatalog(snapshot);
}

/**
 * Loads the whole DummyJSON catalog (~200 products) in one request.
 *
 * The API cannot combine text search with a category filter and has no price
 * filter, so the catalog is fetched once, cached, and narrowed on the server.
 *
 * DummyJSON rate-limits per IP, and serverless functions share outbound IPs
 * with other apps, so a cold request can be refused. Failed requests are
 * retried; if the API is still unavailable, a snapshot bundled with the app is
 * served (and cached briefly, so the live data is tried again soon). The page
 * therefore never fails because of the API.
 */
export async function fetchProductCatalog(): Promise<ProductDetails[]> {
  "use cache";
  cacheTag(PRODUCT_CATALOG_CACHE_TAG);

  try {
    const json = await fetchJsonWithRetry(buildCatalogUrl(), {
      init: {
        cache: "force-cache",
        next: {
          revalidate: CATALOG_REVALIDATE_SECONDS,
          tags: [PRODUCT_CATALOG_CACHE_TAG],
        },
      },
    });
    const catalog = parseDummyJsonCatalog(json);
    cacheLife("hours");
    return catalog;
  } catch (error) {
    console.error(
      "[product-catalog] DummyJSON unavailable, serving the bundled snapshot:",
      error,
    );
    cacheLife("minutes");
    return loadCatalogSnapshot();
  }
}
