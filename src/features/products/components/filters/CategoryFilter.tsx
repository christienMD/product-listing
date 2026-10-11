"use client";

import { cn } from "cn";
import { FilterSection } from "@/features/products/components/filters/FilterSection";
import { useProductQuery } from "@/features/products/hooks/use-product-query";
import type { CategoryFacet } from "@/features/products/types";

function CategoryOption({
  label,
  productCount,
  isSelected,
  onSelect,
}: {
  label: string;
  productCount: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={onSelect}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
          isSelected && "bg-muted font-medium",
        )}
      >
        <span className="truncate">{label}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {productCount}
        </span>
      </button>
    </li>
  );
}

export function CategoryFilter({ categories }: { categories: CategoryFacet[] }) {
  const { query, updateQuery } = useProductQuery();
  const totalProducts = categories.reduce(
    (sum, category) => sum + category.productCount,
    0,
  );

  return (
    <FilterSection title="Category">
      <ul className="-mx-2.5 flex max-h-80 flex-col gap-0.5 overflow-y-auto px-px">
        <CategoryOption
          label="All categories"
          productCount={totalProducts}
          isSelected={query.category === null}
          onSelect={() => updateQuery({ category: null })}
        />
        {categories.map((category) => (
          <CategoryOption
            key={category.slug}
            label={category.name}
            productCount={category.productCount}
            isSelected={query.category === category.slug}
            onSelect={() => updateQuery({ category: category.slug })}
          />
        ))}
      </ul>
    </FilterSection>
  );
}
