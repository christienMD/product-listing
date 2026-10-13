import { Suspense } from "react";
import { PageContainer } from "@/components/PageContainer";
import { ProductListing } from "@/features/products/components/ProductListing";
import { ProductListingSkeleton } from "@/features/products/components/ProductListingSkeleton";

export default function ProductsPage({ searchParams }: PageProps<"/">) {
  return (
    <PageContainer className="flex flex-col gap-5 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Products
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse, search and filter the catalog.
        </p>
      </header>

      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductListing searchParams={searchParams} />
      </Suspense>
    </PageContainer>
  );
}
