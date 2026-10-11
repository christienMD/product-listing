import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import type { Product } from "@/features/products/types";

const DUMMYJSON_PRODUCTS_URL = "https://dummyjson.com/products";

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
  "tags",
  "availabilityStatus",
] as const;

const CATALOG_REVALIDATE_SECONDS = 60 * 60;

export const PRODUCT_CATALOG_CACHE_TAG = "product-catalog";

const dummyJsonProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  // About half of the DummyJSON catalog has no brand at all.
  brand: z.string().optional(),
  thumbnail: z.string(),
  tags: z.array(z.string()),
  availabilityStatus: z.string(),
});

const dummyJsonProductListSchema = z.object({
  products: z.array(dummyJsonProductSchema),
  total: z.number(),
});

/**
 * Loads the whole DummyJSON catalog (~200 products) in one request.
 *
 * The API cannot combine text search with a category filter and has no price
 * filter, and it rate-limits bursts of requests. So the catalog is fetched once,
 * cached, and narrowed on the server instead of calling the API per filter.
 * `use cache` dedupes within an instance; the `fetch` cache persists the
 * response across serverless instances.
 */
export async function fetchProductCatalog(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(PRODUCT_CATALOG_CACHE_TAG);

  const url = new URL(DUMMYJSON_PRODUCTS_URL);
  url.searchParams.set("limit", "0");
  url.searchParams.set("select", PRODUCT_FIELDS.join(","));

  const response = await fetch(url.toString(), {
    cache: "force-cache",
    next: {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: [PRODUCT_CATALOG_CACHE_TAG],
    },
  });

  if (!response.ok) {
    throw new Error(
      `DummyJSON catalog request failed: ${response.status} ${response.statusText}`,
    );
  }

  const { products } = dummyJsonProductListSchema.parse(await response.json());

  return products.map((product) => ({
    ...product,
    brand: product.brand ?? null,
  }));
}
