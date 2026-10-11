import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAGE_GAP, buildPageList } from "@/features/products/lib/build-page-list";
import { toProductSearchParams } from "@/features/products/lib/product-query-params";
import type { ProductQuery } from "@/features/products/types";

function pageHref(query: ProductQuery, page: number): string {
  const params = toProductSearchParams({ ...query, page }).toString();
  return params ? `/?${params}` : "/";
}

export function ProductPagination({
  query,
  page,
  pageCount,
}: {
  query: ProductQuery;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <PageStepLink
        query={query}
        page={page - 1}
        disabled={page <= 1}
        label="Previous page"
      >
        <ChevronLeftIcon aria-hidden />
      </PageStepLink>

      {buildPageList(page, pageCount).map((item, index) =>
        item === PAGE_GAP ? (
          <span
            key={`gap-${index}`}
            className="px-1 text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "default" : "ghost"}
            size="icon"
            asChild
          >
            <Link
              href={pageHref(query, item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Link>
          </Button>
        ),
      )}

      <PageStepLink
        query={query}
        page={page + 1}
        disabled={page >= pageCount}
        label="Next page"
      >
        <ChevronRightIcon aria-hidden />
      </PageStepLink>
    </nav>
  );
}

function PageStepLink({
  query,
  page,
  disabled,
  label,
  children,
}: {
  query: ProductQuery;
  page: number;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label={label}>
        {children}
      </Button>
    );
  }
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href={pageHref(query, page)} aria-label={label}>
        {children}
      </Link>
    </Button>
  );
}
