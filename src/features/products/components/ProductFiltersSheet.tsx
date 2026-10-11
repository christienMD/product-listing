"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilters } from "@/features/products/components/filters/ProductFilters";
import { useProductQuery } from "@/features/products/hooks/use-product-query";
import { countActiveFilters } from "@/features/products/lib/product-query-params";
import type { CatalogFacets } from "@/features/products/types";

/** Filters in a slide-over panel, for screens too narrow for the sidebar. */
export function ProductFiltersSheet({ facets }: { facets: CatalogFacets }) {
  const { query } = useProductQuery();
  const activeFilterCount = countActiveFilters(query);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="lg" className="flex-1 sm:flex-none lg:hidden">
          <SlidersHorizontalIcon aria-hidden />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-0.5 h-4.5 min-w-4.5 px-1 tabular-nums">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs gap-0">
        <SheetHeader className="border-b">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Results update as you choose.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <ProductFilters facets={facets} />
        </div>
        <SheetFooter className="border-t">
          <SheetClose asChild>
            <Button size="lg">Show results</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
