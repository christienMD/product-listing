import { z } from "zod";
import type { ProductDetails } from "@/features/products/types";

const dummyJsonReviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
});

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
  images: z.array(z.string()),
  tags: z.array(z.string()),
  availabilityStatus: z.string(),
  sku: z.string(),
  weight: z.number(),
  dimensions: z.object({ width: z.number(), height: z.number(), depth: z.number() }),
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number(),
  reviews: z.array(dummyJsonReviewSchema),
});

const dummyJsonProductListSchema = z.object({
  products: z.array(dummyJsonProductSchema).min(1),
});

/**
 * Validates a DummyJSON `/products` response (live, or the bundled snapshot)
 * and maps it to `ProductDetails`. Unknown fields are dropped. Throws if the
 * shape is wrong, so a bad response is never cached as an empty catalog.
 */
export function parseDummyJsonCatalog(json: unknown): ProductDetails[] {
  const { products } = dummyJsonProductListSchema.parse(json);
  return products.map((product) => ({
    ...product,
    brand: product.brand ?? null,
  }));
}
