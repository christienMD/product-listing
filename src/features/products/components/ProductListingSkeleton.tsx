import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/features/products/components/ProductGridSkeleton";
import { ProductListingLayout } from "@/features/products/components/ProductListingLayout";

const SIDEBAR_ROW_COUNT = 8;

export function ProductListingSkeleton() {
  return (
    <ProductListingLayout
      sidebar={
        <div className="flex flex-col gap-2">
          <Skeleton className="mb-1 h-3 w-20" />
          {Array.from({ length: SIDEBAR_ROW_COUNT }, (_, index) => (
            <Skeleton key={index} className="h-7 w-full rounded-lg" />
          ))}
        </div>
      }
      toolbar={
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 basis-full rounded-full sm:basis-0 sm:flex-1" />
          <Skeleton className="h-9 flex-1 rounded-full sm:w-24 sm:flex-none lg:hidden" />
          <Skeleton className="h-9 flex-1 rounded-full sm:w-48 sm:flex-none" />
        </div>
      }
    >
      <ProductGridSkeleton />
    </ProductListingLayout>
  );
}
