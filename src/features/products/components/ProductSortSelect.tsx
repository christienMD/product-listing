"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductQuery } from "@/features/products/hooks/use-product-query";
import { PRODUCT_SORT_OPTIONS } from "@/features/products/lib/product-query-params";
import type { ProductSort } from "@/features/products/types";

export function ProductSortSelect() {
  const { query, updateQuery } = useProductQuery();
  const selectedLabel = PRODUCT_SORT_OPTIONS.find(
    (option) => option.value === query.sort,
  )?.label;

  return (
    <Select
      value={query.sort}
      onValueChange={(sort) => updateQuery({ sort: sort as ProductSort })}
    >
      <SelectTrigger aria-label="Sort products" className="h-9 min-w-0 flex-1 sm:w-48 sm:flex-none">
        {/* Explicit label so the value renders on the server, before Radix mounts the options. */}
        <SelectValue>{selectedLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {PRODUCT_SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
