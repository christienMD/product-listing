import { describe, expect, it } from "vitest";
import snapshot from "@/features/products/data/product-catalog-snapshot.json";
import { parseDummyJsonCatalog } from "@/features/products/lib/parse-dummyjson-catalog";

describe("parseDummyJsonCatalog", () => {
  it("parses the bundled fallback snapshot", () => {
    const catalog = parseDummyJsonCatalog(snapshot);
    expect(catalog).toHaveLength(194);
    expect(new Set(catalog.map((product) => product.id)).size).toBe(194);
    expect(catalog.every((product) => product.images.length > 0)).toBe(true);
  });

  it("maps a missing brand to null and drops unknown fields", () => {
    const [product] = parseDummyJsonCatalog({
      products: [{ ...snapshot.products[0], brand: undefined, meta: { x: 1 } }],
    });
    expect(product.brand).toBeNull();
    expect(product).not.toHaveProperty("meta");
  });

  it("rejects an empty or malformed response", () => {
    expect(() => parseDummyJsonCatalog({ products: [] })).toThrow();
    expect(() => parseDummyJsonCatalog({ message: "request limit exceeded" })).toThrow();
  });
});
