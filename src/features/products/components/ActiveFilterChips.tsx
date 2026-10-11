"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductQuery } from "@/features/products/hooks/use-product-query";
import { formatCategoryName } from "@/features/products/lib/catalog-facets";
import { formatPrice } from "@/features/products/lib/format-price";
import type { ProductQuery } from "@/features/products/types";

type FilterChip = {
  key: string;
  label: string;
  removal: Partial<ProductQuery>;
};

function describePriceRange(minPrice: number | null, maxPrice: number | null) {
  if (minPrice !== null && maxPrice !== null) {
    return `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;
  }
  return minPrice !== null
    ? `From ${formatPrice(minPrice)}`
    : `Up to ${formatPrice(maxPrice ?? 0)}`;
}

function buildFilterChips(query: ProductQuery): FilterChip[] {
  const chips: FilterChip[] = [];
  if (query.search) {
    chips.push({ key: "search", label: `“${query.search}”`, removal: { search: "" } });
  }
  if (query.category) {
    chips.push({
      key: "category",
      label: formatCategoryName(query.category),
      removal: { category: null },
    });
  }
  if (query.minPrice !== null || query.maxPrice !== null) {
    chips.push({
      key: "price",
      label: describePriceRange(query.minPrice, query.maxPrice),
      removal: { minPrice: null, maxPrice: null },
    });
  }
  if (query.minRating !== null) {
    chips.push({
      key: "rating",
      label: `${query.minRating}★ & up`,
      removal: { minRating: null },
    });
  }
  if (query.inStockOnly) {
    chips.push({ key: "stock", label: "In stock", removal: { inStockOnly: false } });
  }
  return chips;
}

export function ActiveFilterChips() {
  const { query, updateQuery, clearFilters } = useProductQuery();
  const chips = buildFilterChips(query);

  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Button
            variant="secondary"
            size="sm"
            aria-label={`Remove filter: ${chip.label}`}
            onClick={() => updateQuery(chip.removal)}
          >
            {chip.label}
            <XIcon aria-hidden />
          </Button>
        </li>
      ))}
      <li>
        <Button variant="link" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </li>
    </ul>
  );
}
