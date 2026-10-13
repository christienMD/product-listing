// Remembers the listing URL (search, filters, page) for the current tab, so
// "Back to products" on a details page returns to the same results.
const LAST_LISTING_URL_KEY = "product-listing:last-url";

export const DEFAULT_LISTING_URL = "/";

export function saveLastListingUrl(url: string): void {
  try {
    sessionStorage.setItem(LAST_LISTING_URL_KEY, url);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); "/" is fine then.
  }
}

export function readLastListingUrl(): string {
  try {
    const url = sessionStorage.getItem(LAST_LISTING_URL_KEY);
    // Only same-site listing paths, never an arbitrary stored value.
    return url?.startsWith("/") && !url.startsWith("//") ? url : DEFAULT_LISTING_URL;
  } catch {
    return DEFAULT_LISTING_URL;
  }
}
