import { describe, expect, it } from "vitest";
import {
  filterProducts,
  queryProducts,
  sortProducts,
} from "@/features/products/lib/filter-products";
import { DEFAULT_PRODUCT_QUERY } from "@/features/products/lib/product-query-params";
import type { Product, ProductQuery } from "@/features/products/types";

function makeProduct(overrides: Partial<Product> & { id: number }): Product {
  return {
    title: `Product ${overrides.id}`,
    description: "",
    category: "misc",
    price: 10,
    discountPercentage: 0,
    rating: 3,
    stock: 5,
    brand: null,
    thumbnail: "https://cdn.dummyjson.com/x.webp",
    tags: [],
    availabilityStatus: "In Stock",
    ...overrides,
  };
}

const catalog: Product[] = [
  makeProduct({ id: 1, title: "iPhone 13 Pro", brand: "Apple", category: "smartphones", price: 1099, rating: 4.5 }),
  makeProduct({ id: 2, title: "Galaxy S10", brand: "Samsung", category: "smartphones", price: 699, rating: 3.9, stock: 0 }),
  makeProduct({ id: 3, title: "Crème Brûlée Candle", category: "home-decoration", price: 12, rating: 4.9, tags: ["candles"] }),
  makeProduct({ id: 4, title: "Apple Watch", brand: "Apple", category: "mens-watches", price: 399, rating: 2.5 }),
];

const query = (overrides: Partial<ProductQuery>): ProductQuery => ({
  ...DEFAULT_PRODUCT_QUERY,
  ...overrides,
});

const ids = (products: Product[]) => products.map((product) => product.id);

describe("filterProducts", () => {
  it("returns everything for the default query", () => {
    expect(ids(filterProducts(catalog, DEFAULT_PRODUCT_QUERY))).toEqual([1, 2, 3, 4]);
  });

  it("matches search terms across title and brand, case-insensitively", () => {
    expect(ids(filterProducts(catalog, query({ search: "APPLE" })))).toEqual([1, 4]);
    expect(ids(filterProducts(catalog, query({ search: "apple watch" })))).toEqual([4]);
  });

  it("ignores accents and matches category words and tags", () => {
    expect(ids(filterProducts(catalog, query({ search: "creme" })))).toEqual([3]);
    expect(ids(filterProducts(catalog, query({ search: "home decoration" })))).toEqual([3]);
    expect(ids(filterProducts(catalog, query({ search: "candles" })))).toEqual([3]);
  });

  it("combines search with category, which the API itself cannot do", () => {
    expect(
      ids(filterProducts(catalog, query({ search: "apple", category: "smartphones" }))),
    ).toEqual([1]);
  });

  it("applies an inclusive price range", () => {
    expect(
      ids(filterProducts(catalog, query({ minPrice: 399, maxPrice: 699 }))),
    ).toEqual([2, 4]);
  });

  it("applies minimum rating and in-stock filters", () => {
    expect(ids(filterProducts(catalog, query({ minRating: 4 })))).toEqual([1, 3]);
    expect(ids(filterProducts(catalog, query({ inStockOnly: true })))).toEqual([1, 3, 4]);
  });
});

describe("sortProducts", () => {
  it("keeps the original order for featured", () => {
    expect(ids(sortProducts(catalog, "featured"))).toEqual([1, 2, 3, 4]);
  });

  it("sorts by price, rating and title without mutating the input", () => {
    expect(ids(sortProducts(catalog, "price-asc"))).toEqual([3, 4, 2, 1]);
    expect(ids(sortProducts(catalog, "price-desc"))).toEqual([1, 2, 4, 3]);
    expect(ids(sortProducts(catalog, "rating-desc"))).toEqual([3, 1, 2, 4]);
    expect(ids(sortProducts(catalog, "title-asc"))).toEqual([4, 3, 2, 1]);
    expect(ids(catalog)).toEqual([1, 2, 3, 4]);
  });
});

describe("queryProducts", () => {
  it("slices the requested page and reports totals", () => {
    const result = queryProducts(catalog, query({ page: 2 }), 3);
    expect(ids(result.products)).toEqual([4]);
    expect(result).toMatchObject({ totalMatches: 4, page: 2, pageCount: 2 });
  });

  it("clamps a page past the end to the last page", () => {
    const result = queryProducts(catalog, query({ page: 99 }), 3);
    expect(result.page).toBe(2);
    expect(ids(result.products)).toEqual([4]);
  });

  it("reports one empty page when nothing matches", () => {
    expect(queryProducts(catalog, query({ search: "zzz" }), 3)).toEqual({
      products: [],
      totalMatches: 0,
      page: 1,
      pageCount: 1,
    });
  });
});
