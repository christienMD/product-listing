import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyResults() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
        <SearchXIcon className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <div className="space-y-1">
        <h2 className="font-medium">No products match</h2>
        <p className="text-sm text-muted-foreground">
          Try a different search or loosen your filters.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/">Clear all filters</Link>
      </Button>
    </div>
  );
}
