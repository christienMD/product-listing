"use client";

import { createContext, useContext } from "react";
import type { ProductQuery } from "@/features/products/types";

export type ProductQueryContextValue = {
  /** The query the UI should show; ahead of the URL while a change is loading. */
  query: ProductQuery;
  /** Merges a change into the query and navigates. Resets to page 1 unless `page` is given. */
  updateQuery: (change: Partial<ProductQuery>) => void;
  /** Drops search and every filter; keeps the sort order. */
  clearFilters: () => void;
  /** True while the listing for a new query is loading. */
  isPending: boolean;
};

export const ProductQueryContext = createContext<ProductQueryContextValue | null>(
  null,
);

export function useProductQuery(): ProductQueryContextValue {
  const context = useContext(ProductQueryContext);
  if (!context) {
    throw new Error("useProductQuery must be used inside <ProductQueryProvider>");
  }
  return context;
}
