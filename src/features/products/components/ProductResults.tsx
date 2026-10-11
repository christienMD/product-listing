import { getProductPage } from "@/features/products/api/get-product-page";
import { EmptyResults } from "@/features/products/components/EmptyResults";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductPagination } from "@/features/products/components/ProductPagination";
import {
  PRODUCTS_PER_PAGE,
  parseProductQuery,
  type PageSearchParams,
} from "@/features/products/lib/product-query-params";

function describeRange(page: number, shown: number, total: number): string {
  if (total === 0) return "No products found";
  const first = (page - 1) * PRODUCTS_PER_PAGE + 1;
  const last = first + shown - 1;
  return `Showing ${first}–${last} of ${total} product${total === 1 ? "" : "s"}`;
}

/** Reads the URL query, so it must render inside a <Suspense> boundary. */
export async function ProductResults({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const query = parseProductQuery(await searchParams);
  const { products, totalMatches, page, pageCount } = await getProductPage(query);

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
