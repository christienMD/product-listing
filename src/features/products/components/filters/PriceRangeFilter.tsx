"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FilterSection } from "@/features/products/components/filters/FilterSection";
import { useProductQuery } from "@/features/products/hooks/use-product-query";
import type { CatalogFacets } from "@/features/products/types";

function toInputValue(price: number | null): string {
  return price === null ? "" : String(price);
}

function parsePriceInput(value: string): number | null {
  if (value.trim() === "") return null;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

/** Min/max inputs that apply on blur or Enter rather than on every keystroke. */
export function PriceRangeFilter({
  priceRange,
}: {
  priceRange: CatalogFacets["priceRange"];
}) {
  const { query, updateQuery } = useProductQuery();
  const [minValue, setMinValue] = useState(toInputValue(query.minPrice));
  const [maxValue, setMaxValue] = useState(toInputValue(query.maxPrice));
  const [syncedRange, setSyncedRange] = useState([query.minPrice, query.maxPrice]);

  // Adopt changes made elsewhere, e.g. removing the price chip.
  if (syncedRange[0] !== query.minPrice || syncedRange[1] !== query.maxPrice) {
    setSyncedRange([query.minPrice, query.maxPrice]);
    setMinValue(toInputValue(query.minPrice));
    setMaxValue(toInputValue(query.maxPrice));
  }

  const applyPriceRange = () => {
    let minPrice = parsePriceInput(minValue);
    let maxPrice = parsePriceInput(maxValue);
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }
    // Normalise what the inputs show (e.g. swapped or invalid values).
    setMinValue(toInputValue(minPrice));
    setMaxValue(toInputValue(maxPrice));
    if (minPrice === query.minPrice && maxPrice === query.maxPrice) return;
    updateQuery({ minPrice, maxPrice });
  };

  return (
    <FilterSection title="Price (USD)">
      <form
        className="grid grid-cols-2 gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          applyPriceRange();
        }}
      >
        <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          Min
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder={String(priceRange.min)}
            value={minValue}
            onChange={(event) => setMinValue(event.target.value)}
            onBlur={applyPriceRange}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          Max
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder={String(priceRange.max)}
            value={maxValue}
            onChange={(event) => setMaxValue(event.target.value)}
            onBlur={applyPriceRange}
          />
        </label>
        {/* Lets Enter submit the form from either input. */}
        <button type="submit" hidden />
      </form>
    </FilterSection>
  );
}
