import { fetchProductCatalog } from "@/features/products/api/fetch-product-catalog";
import type { ProductDetails } from "@/features/products/types";

const PRODUCT_ID_PATTERN = /^[1-9]\d*$/;

/** Returns the product for a URL id segment, or null if it doesn't exist. */
export async function getProductDetails(
  productId: string,
): Promise<ProductDetails | null> {
  if (!PRODUCT_ID_PATTERN.test(productId)) return null;
  const catalog = await fetchProductCatalog();
  return catalog.find((product) => product.id === Number(productId)) ?? null;
}

/** Every product id, for prerendering each details page at build time. */
export async function getAllProductIds(): Promise<number[]> {
  const catalog = await fetchProductCatalog();
  return catalog.map((product) => product.id);
}
