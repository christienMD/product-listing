import { PRODUCTS_PER_PAGE } from "@/features/products/lib/product-query-params";
import type {
  Product,
  ProductPage,
  ProductQuery,
  ProductSort,
} from "@/features/products/types";

function normalizeText(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function toSearchableText(product: Product): string {
  return normalizeText(
    [
      product.title,
      product.brand ?? "",
      product.category.replaceAll("-", " "),
      ...product.tags,
    ].join(" "),
  );
}

/** Every whitespace-separated term must appear in the product's text. */
function matchesSearch(product: Product, searchTerms: string[]): boolean {
  if (searchTerms.length === 0) return true;
  const searchableText = toSearchableText(product);
  return searchTerms.every((term) => searchableText.includes(term));
}

export function filterProducts(
  catalog: Product[],
  query: ProductQuery,
): Product[] {
  const searchTerms = normalizeText(query.search).split(/\s+/).filter(Boolean);

  return catalog.filter(
    (product) =>
      (query.category === null || product.category === query.category) &&
      (query.minPrice === null || product.price >= query.minPrice) &&
      (query.maxPrice === null || product.price <= query.maxPrice) &&
      (query.minRating === null || product.rating >= query.minRating) &&
      (!query.inStockOnly || product.stock > 0) &&
      matchesSearch(product, searchTerms),
  );
}

const PRODUCT_COMPARATORS: Record<
  Exclude<ProductSort, "featured">,
  (a: Product, b: Product) => number
> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
  "title-asc": (a, b) => a.title.localeCompare(b.title),
};

/** Returns a sorted copy; "featured" keeps the API's original order. */
export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  if (sort === "featured") return products;
  return products.toSorted(PRODUCT_COMPARATORS[sort]);
}

/** Filters, sorts and slices the catalog into the requested page. */
export function queryProducts(
  catalog: Product[],
  query: ProductQuery,
  pageSize: number = PRODUCTS_PER_PAGE,
): ProductPage {
  const matches = sortProducts(filterProducts(catalog, query), query.sort);
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(query.page, pageCount);
  const start = (page - 1) * pageSize;

  return {
    products: matches.slice(start, start + pageSize),
    totalMatches: matches.length,
    page,
    pageCount,
  };
}
