import { Skeleton } from "@/components/ui/skeleton";
import { PRODUCT_GRID_CLASS_NAME } from "@/features/products/components/ProductGrid";
import { PRODUCTS_PER_PAGE } from "@/features/products/lib/product-query-params";

export function ProductGridSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <Skeleton className="mb-4 h-5 w-48" />
      <ul className={PRODUCT_GRID_CLASS_NAME}>
        {Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => (
          <li
            key={index}
            className="flex flex-col gap-3 rounded-2xl p-2.5 ring-1 ring-foreground/10 sm:p-3"
          >
            <Skeleton className="aspect-square rounded-xl" />
            <div className="flex flex-col gap-2 px-1 pb-1">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
