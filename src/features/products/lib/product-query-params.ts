import type { ProductQuery, ProductSort } from "@/features/products/types";

export const PRODUCTS_PER_PAGE = 12;

const MAX_SEARCH_LENGTH = 100;

export const PRODUCT_SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Top rated" },
  { value: "title-asc", label: "Name: A to Z" },
];

export const MIN_RATING_OPTIONS = [4, 3, 2] as const;

/** URL query-string key for each `ProductQuery` field. */
export const PRODUCT_QUERY_PARAM = {
  search: "q",
  category: "category",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  minRating: "rating",
  inStockOnly: "inStock",
  sort: "sort",
  page: "page",
} as const satisfies Record<keyof ProductQuery, string>;

export const DEFAULT_PRODUCT_QUERY: ProductQuery = {
  search: "",
  category: null,
  minPrice: null,
  maxPrice: null,
  minRating: null,
  inStockOnly: false,
  sort: "featured",
  page: 1,
};

/** The shape Next.js passes to a page as `searchParams`. */
export type PageSearchParams = Record<string, string | string[] | undefined>;

const CATEGORY_SLUG_PATTERN = /^[a-z0-9-]+$/;

function readFirstValue(
  params: PageSearchParams | URLSearchParams,
  key: string,
): string | undefined {
  if (params instanceof URLSearchParams) {
    return params.get(key) ?? undefined;
  }
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function parseNonNegativeNumber(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function parseSort(value: string | undefined): ProductSort {
  const option = PRODUCT_SORT_OPTIONS.find((sort) => sort.value === value);
  return option?.value ?? DEFAULT_PRODUCT_QUERY.sort;
}

function parsePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

function parseMinRating(value: string | undefined): number | null {
  const rating = parseNonNegativeNumber(value);
  return rating !== null && rating > 0 && rating <= 5 ? rating : null;
}

/**
 * Turns untrusted URL query values into a valid `ProductQuery`.
 * Invalid values fall back to their defaults instead of throwing, so a
 * hand-edited URL still renders a listing.
 */
export function parseProductQuery(
  params: PageSearchParams | URLSearchParams,
): ProductQuery {
  const read = (field: keyof ProductQuery) =>
    readFirstValue(params, PRODUCT_QUERY_PARAM[field]);

  const search = (read("search") ?? "").trim().slice(0, MAX_SEARCH_LENGTH);
  const category = read("category")?.trim().toLowerCase() ?? "";

  let minPrice = parseNonNegativeNumber(read("minPrice"));
  let maxPrice = parseNonNegativeNumber(read("maxPrice"));
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  return {
    search,
    category: CATEGORY_SLUG_PATTERN.test(category) ? category : null,
    minPrice,
    maxPrice,
    minRating: parseMinRating(read("minRating")),
    inStockOnly: read("inStockOnly") === "1",
    sort: parseSort(read("sort")),
    page: parsePage(read("page")),
  };
}

/** Serializes a query back to URL params, leaving out fields at their default. */
export function toProductSearchParams(query: ProductQuery): URLSearchParams {
  const params = new URLSearchParams();
  const set = (field: keyof ProductQuery, value: string) =>
    params.set(PRODUCT_QUERY_PARAM[field], value);

  if (query.search) set("search", query.search);
  if (query.category) set("category", query.category);
  if (query.minPrice !== null) set("minPrice", String(query.minPrice));
  if (query.maxPrice !== null) set("maxPrice", String(query.maxPrice));
  if (query.minRating !== null) set("minRating", String(query.minRating));
  if (query.inStockOnly) set("inStockOnly", "1");
  if (query.sort !== DEFAULT_PRODUCT_QUERY.sort) set("sort", query.sort);
  if (query.page > 1) set("page", String(query.page));

  return params;
}

/** Number of narrowing filters in effect (search and sort excluded). */
export function countActiveFilters(query: ProductQuery): number {
  return [
    query.category !== null,
    query.minPrice !== null || query.maxPrice !== null,
    query.minRating !== null,
    query.inStockOnly,
  ].filter(Boolean).length;
}
