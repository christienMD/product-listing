import { describe, expect, it } from "vitest";
import { PAGE_GAP, buildPageList } from "@/features/products/lib/build-page-list";

describe("buildPageList", () => {
  it("lists a single page", () => {
    expect(buildPageList(1, 1)).toEqual([1]);
  });

  it("lists every page when there are no gaps", () => {
    expect(buildPageList(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("adds gaps around the current page in a long list", () => {
    expect(buildPageList(6, 12)).toEqual([1, PAGE_GAP, 5, 6, 7, PAGE_GAP, 12]);
  });

  it("keeps the edges tight at the start and end", () => {
    expect(buildPageList(1, 12)).toEqual([1, 2, PAGE_GAP, 12]);
    expect(buildPageList(12, 12)).toEqual([1, PAGE_GAP, 11, 12]);
  });
});
