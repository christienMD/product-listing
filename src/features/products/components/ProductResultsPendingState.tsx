"use client";

import type { ReactNode } from "react";
import { useProductQuery } from "@/features/products/hooks/use-product-query";

/** Dims the current results while the listing for a new query loads. */
export function ProductResultsPendingState({ children }: { children: ReactNode }) {
  const { isPending } = useProductQuery();

  return (
    <div
      aria-busy={isPending}
      data-pending={isPending}
      className="transition-opacity duration-200 data-[pending=true]:pointer-events-none data-[pending=true]:opacity-50 data-[pending=true]:delay-150"
    >
      {children}
    </div>
  );
}
