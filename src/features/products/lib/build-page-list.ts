export const PAGE_GAP = "gap";

/**
 * Page numbers to show in the pagination bar: first, last, and the current
 * page with its neighbours, with gaps between non-adjacent runs.
 * e.g. page 6 of 12 → [1, "gap", 5, 6, 7, "gap", 12]
 */
export function buildPageList(
  page: number,
  pageCount: number,
): (number | typeof PAGE_GAP)[] {
  const pages = [...new Set([1, pageCount, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  return pages.flatMap((p, index) =>
    index > 0 && p - pages[index - 1] > 1 ? [PAGE_GAP, p] : [p],
  );
}
