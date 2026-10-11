import { fetchProductCatalog } from "@/features/products/api/fetch-product-catalog";
import { queryProducts } from "@/features/products/lib/filter-products";
import type { ProductPage, ProductQuery } from "@/features/products/types";

/**
 * The listing's single data entry point. Today it narrows the cached catalog
 * in memory; if the catalog outgrows that, only this function has to change
 * to push filtering to the data source.
 */
export async function getProductPage(query: ProductQuery): Promise<ProductPage> {
  const catalog = await fetchProductCatalog();
  return queryProducts(catalog, query);
}
