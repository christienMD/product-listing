"use client";

import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterSection } from "@/features/products/components/filters/FilterSection";
import { useProductQuery } from "@/features/products/hooks/use-product-query";

export function InStockFilter() {
  const { query, updateQuery } = useProductQuery();
  const checkboxId = useId();

  return (
    <FilterSection title="Availability">
      <div className="flex items-center gap-2">
        <Checkbox
          id={checkboxId}
          checked={query.inStockOnly}
          onCheckedChange={(checked) => updateQuery({ inStockOnly: checked === true })}
        />
        <Label htmlFor={checkboxId} className="cursor-pointer font-normal">
          In stock only
        </Label>
      </div>
    </FilterSection>
  );
}
