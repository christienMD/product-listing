"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_LISTING_URL,
  readLastListingUrl,
} from "@/features/products/lib/last-listing-url";

// sessionStorage doesn't notify within the same tab, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

/** Returns to the listing with the search and filters the visitor last used. */
export function BackToProductsLink() {
  const listingUrl = useSyncExternalStore(
    subscribeToNothing,
    readLastListingUrl,
    () => DEFAULT_LISTING_URL,
  );

  return (
    <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
      <Link href={listingUrl}>
        <ArrowLeftIcon aria-hidden />
        Back to products
      </Link>
    </Button>
  );
}
