import { describe, expect, it } from "vitest";
import {
  buildCatalogFacets,
  formatCategoryName,
} from "@/features/products/lib/catalog-facets";
import type { Product } from "@/features/products/types";

const product = (id: number, category: string, price: number): Product => ({
  id,
  title: `Product ${id}`,
  description: "",
  category,
  price,
  discountPercentage: 0,
  rating: 4,
  stock: 1,
  brand: null,
  thumbnail: "",
  tags: [],
  availabilityStatus: "In Stock",
});

describe("formatCategoryName", () => {
  it("title-cases each dash-separated word", () => {
    expect(formatCategoryName("home-decoration")).toBe("Home Decoration");
    expect(formatCategoryName("laptops")).toBe("Laptops");
  });
});

describe("buildCatalogFacets", () => {
  it("counts products per category, sorted by name, with a whole-number price range", () => {
    expect(
      buildCatalogFacets([
        product(1, "tablets", 0.79),
        product(2, "beauty", 120.5),
        product(3, "tablets", 36999.99),
      ]),
    ).toEqual({
      categories: [
        { slug: "beauty", name: "Beauty", productCount: 1 },
        { slug: "tablets", name: "Tablets", productCount: 2 },
      ],
      priceRange: { min: 0, max: 37000 },
    });
  });

  it("handles an empty catalog", () => {
    expect(buildCatalogFacets([])).toEqual({
      categories: [],
      priceRange: { min: 0, max: 0 },
    });
  });
});
