import { Suspense } from "react";
import { ProductGridSkeleton } from "@/features/products/components/ProductGridSkeleton";
import { ProductResults } from "@/features/products/components/ProductResults";

export default function ProductsPage({ searchParams }: PageProps<"/">) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Products
        </h1>
        <p className="text-muted-foreground">
          Browse, search and filter the catalog.
        </p>
      </header>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
