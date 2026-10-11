import { getCatalogFacets } from "@/features/products/api/get-catalog-facets";
import { getProductPage } from "@/features/products/api/get-product-page";
import { ActiveFilterChips } from "@/features/products/components/ActiveFilterChips";
import { ProductFilters } from "@/features/products/components/filters/ProductFilters";
import { ProductListingLayout } from "@/features/products/components/ProductListingLayout";
import { ProductFiltersSheet } from "@/features/products/components/ProductFiltersSheet";
import { ProductQueryProvider } from "@/features/products/components/ProductQueryProvider";
import { ProductResults } from "@/features/products/components/ProductResults";
import { ProductResultsPendingState } from "@/features/products/components/ProductResultsPendingState";
import { ProductSearchInput } from "@/features/products/components/ProductSearchInput";
import { ProductSortSelect } from "@/features/products/components/ProductSortSelect";
import {
  parseProductQuery,
  type PageSearchParams,
} from "@/features/products/lib/product-query-params";

/** Reads the URL query, so it must render inside a <Suspense> boundary. */
export async function ProductListing({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const query = parseProductQuery(await searchParams);
  const [facets, productPage] = await Promise.all([
    getCatalogFacets(),
    getProductPage(query),
  ]);

  return (
    <ProductQueryProvider query={query}>
      <ProductListingLayout
        sidebar={<ProductFilters facets={facets} />}
        toolbar={
          <>
            <div className="flex flex-wrap items-center gap-2">
              <ProductSearchInput />
              <ProductFiltersSheet facets={facets} />
              <ProductSortSelect />
            </div>
            <ActiveFilterChips />
          </>
        }
      >
        <ProductResultsPendingState>
          <ProductResults query={query} productPage={productPage} />
        </ProductResultsPendingState>
      </ProductListingLayout>
    </ProductQueryProvider>
  );
}
