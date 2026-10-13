import type { ReactNode } from "react";

/** Sidebar + toolbar + results grid. Shared by the page and its skeleton. */
export function ProductListingLayout({
  sidebar,
  toolbar,
  children,
}: {
  sidebar: ReactNode;
  toolbar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside aria-label="Filters" className="hidden lg:block">
        <h2 className="sr-only">Filters</h2>
        <div className="sticky top-18">{sidebar}</div>
      </aside>
      <div className="flex min-w-0 flex-col gap-4">
        {toolbar}
        {children}
      </div>
    </div>
  );
}
