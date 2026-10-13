import { Separator } from "@/components/ui/separator";
import { CategoryFilter } from "@/features/products/components/filters/CategoryFilter";
import { InStockFilter } from "@/features/products/components/filters/InStockFilter";
import { PriceRangeFilter } from "@/features/products/components/filters/PriceRangeFilter";
import { RatingFilter } from "@/features/products/components/filters/RatingFilter";
import type { CatalogFacets } from "@/features/products/types";

/** All filter controls; shared by the desktop sidebar and the mobile sheet. */
export function ProductFilters({ facets }: { facets: CatalogFacets }) {
  return (
    <div className="flex flex-col gap-4">
      <CategoryFilter categories={facets.categories} />
      <Separator />
      <PriceRangeFilter priceRange={facets.priceRange} />
      <Separator />
      <RatingFilter />
      <Separator />
      <InStockFilter />
    </div>
  );
}
