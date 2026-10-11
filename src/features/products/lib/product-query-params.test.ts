import { describe, expect, it } from "vitest";
import {
  DEFAULT_PRODUCT_QUERY,
  countActiveFilters,
  parseProductQuery,
  toProductSearchParams,
} from "@/features/products/lib/product-query-params";

describe("parseProductQuery", () => {
  it("returns the defaults for empty params", () => {
    expect(parseProductQuery({})).toEqual(DEFAULT_PRODUCT_QUERY);
  });

  it("reads every field from a Next.js searchParams object", () => {
    expect(
      parseProductQuery({
        q: "  iphone ",
        category: "Smartphones",
        minPrice: "100",
        maxPrice: "999.5",
        rating: "4",
        inStock: "1",
        sort: "price-desc",
        page: "3",
      }),
    ).toEqual({
      search: "iphone",
      category: "smartphones",
      minPrice: 100,
      maxPrice: 999.5,
      minRating: 4,
      inStockOnly: true,
      sort: "price-desc",
      page: 3,
    });
  });

  it("reads the same fields from URLSearchParams", () => {
    const query = parseProductQuery(
      new URLSearchParams("q=lamp&category=furniture&page=2"),
    );
    expect(query).toMatchObject({ search: "lamp", category: "furniture", page: 2 });
  });

  it("uses the first value when a key repeats", () => {
    expect(parseProductQuery({ category: ["laptops", "tablets"] }).category).toBe(
      "laptops",
    );
  });

  it("falls back to defaults for invalid values", () => {
    expect(
      parseProductQuery({
        category: "<script>",
        minPrice: "-5",
        maxPrice: "abc",
        rating: "9",
        inStock: "yes",
        sort: "random",
        page: "0",
      }),
    ).toEqual(DEFAULT_PRODUCT_QUERY);
  });

  it("swaps a reversed price range", () => {
    const query = parseProductQuery({ minPrice: "500", maxPrice: "50" });
    expect([query.minPrice, query.maxPrice]).toEqual([50, 500]);
  });

  it("caps very long search text", () => {
    expect(parseProductQuery({ q: "a".repeat(500) }).search).toHaveLength(100);
  });
});

describe("toProductSearchParams", () => {
  it("leaves out fields at their default", () => {
    expect(toProductSearchParams(DEFAULT_PRODUCT_QUERY).toString()).toBe("");
  });

  it("round-trips through parseProductQuery", () => {
    const query = {
      search: "red dress",
      category: "womens-dresses",
      minPrice: 10,
      maxPrice: 80,
      minRating: 3,
      inStockOnly: true,
      sort: "rating-desc" as const,
      page: 2,
    };
    expect(parseProductQuery(toProductSearchParams(query))).toEqual(query);
  });
});

describe("countActiveFilters", () => {
  it("counts a price range once and ignores search and sort", () => {
    expect(
      countActiveFilters({
        ...DEFAULT_PRODUCT_QUERY,
        search: "phone",
        sort: "price-asc",
        minPrice: 10,
        maxPrice: 20,
        inStockOnly: true,
      }),
    ).toBe(2);
  });
});
