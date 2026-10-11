import { EmptyResults } from "@/features/products/components/EmptyResults";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductPagination } from "@/features/products/components/ProductPagination";
import { PRODUCTS_PER_PAGE } from "@/features/products/lib/product-query-params";
import type { ProductPage, ProductQuery } from "@/features/products/types";

function describeRange(page: number, shown: number, total: number): string {
  if (total === 0) return "No products found";
  const first = (page - 1) * PRODUCTS_PER_PAGE + 1;
  const last = first + shown - 1;
  return `Showing ${first}–${last} of ${total} product${total === 1 ? "" : "s"}`;
}

export function ProductResults({
  query,
  productPage,
}: {
  query: ProductQuery;
  productPage: ProductPage;
}) {
  const { products, totalMatches, page, pageCount } = productPage;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {describeRange(page, products.length, totalMatches)}
      </p>
      {products.length > 0 ? <ProductGrid products={products} /> : <EmptyResults />}
      <ProductPagination query={query} page={page} pageCount={pageCount} />
    </div>
  );
}
