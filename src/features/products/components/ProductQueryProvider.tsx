"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ProductQueryContext,
  type ProductQueryContextValue,
} from "@/features/products/hooks/use-product-query";
import { saveLastListingUrl } from "@/features/products/lib/last-listing-url";
import {
  DEFAULT_PRODUCT_QUERY,
  toProductSearchParams,
} from "@/features/products/lib/product-query-params";
import type { ProductQuery } from "@/features/products/types";

/**
 * Owns the listing's URL state. `query` comes from the server, parsed from the
 * same URL, so server and client never disagree. Changes are applied
 * optimistically so controls respond at once while the new results stream in.
 */
export function ProductQueryProvider({
  query,
  children,
}: {
  query: ProductQuery;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [optimisticQuery, setOptimisticQuery] = useOptimistic(query);

  // `query` only changes once the URL has, so this records loaded listings only.
  useEffect(() => {
    const params = toProductSearchParams(query).toString();
    saveLastListingUrl(params ? `${pathname}?${params}` : pathname);
  }, [pathname, query]);

  const navigateToQuery = useCallback(
    (nextQuery: ProductQuery) => {
      startTransition(() => {
        setOptimisticQuery(nextQuery);
        const params = toProductSearchParams(nextQuery).toString();
        router.replace(params ? `${pathname}?${params}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, setOptimisticQuery],
  );

  const value = useMemo<ProductQueryContextValue>(
    () => ({
      query: optimisticQuery,
      isPending,
      updateQuery: (change) =>
        navigateToQuery({ ...optimisticQuery, page: 1, ...change }),
      clearFilters: () =>
        navigateToQuery({ ...DEFAULT_PRODUCT_QUERY, sort: optimisticQuery.sort }),
    }),
    [optimisticQuery, isPending, navigateToQuery],
  );

  return (
    <ProductQueryContext.Provider value={value}>
      {children}
    </ProductQueryContext.Provider>
  );
}
