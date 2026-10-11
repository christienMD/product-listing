import type { CatalogFacets, Product } from "@/features/products/types";

/** "home-decoration" → "Home Decoration" */
export function formatCategoryName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Category list with counts and the overall price range, for the filter UI. */
export function buildCatalogFacets(catalog: Product[]): CatalogFacets {
  const productCountByCategory = new Map<string, number>();
  for (const product of catalog) {
    productCountByCategory.set(
      product.category,
      (productCountByCategory.get(product.category) ?? 0) + 1,
    );
  }

  const categories = [...productCountByCategory]
    .map(([slug, productCount]) => ({
      slug,
      name: formatCategoryName(slug),
      productCount,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const prices = catalog.map((product) => product.price);

  return {
    categories,
    priceRange: {
      min: prices.length ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length ? Math.ceil(Math.max(...prices)) : 0,
    },
  };
}
