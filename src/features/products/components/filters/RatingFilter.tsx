"use client";

import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/features/products/components/filters/FilterSection";
import { useProductQuery } from "@/features/products/hooks/use-product-query";
import { MIN_RATING_OPTIONS } from "@/features/products/lib/product-query-params";

export function RatingFilter() {
  const { query, updateQuery } = useProductQuery();

  return (
    <FilterSection title="Rating">
      <div className="flex flex-wrap gap-2">
        {MIN_RATING_OPTIONS.map((rating) => {
          const isSelected = query.minRating === rating;
          return (
            <Button
              key={rating}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "secondary"}
              aria-pressed={isSelected}
              aria-label={`${rating} stars and up`}
              onClick={() => updateQuery({ minRating: isSelected ? null : rating })}
            >
              <StarIcon className="fill-current" aria-hidden />
              {rating}+
            </Button>
          );
        })}
      </div>
    </FilterSection>
  );
}
