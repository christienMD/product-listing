import { fetchProductCatalog } from "@/features/products/api/fetch-product-catalog";
import { buildCatalogFacets } from "@/features/products/lib/catalog-facets";
import type { CatalogFacets } from "@/features/products/types";

export async function getCatalogFacets(): Promise<CatalogFacets> {
  const catalog = await fetchProductCatalog();
  return buildCatalogFacets(catalog);
}
