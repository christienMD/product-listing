import Link from "next/link";
import { PackageIcon } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <PageContainer className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <PackageIcon className="size-4" aria-hidden />
          </span>
          Product Catalog
        </Link>
        <ThemeToggle />
      </PageContainer>
    </header>
  );
}
