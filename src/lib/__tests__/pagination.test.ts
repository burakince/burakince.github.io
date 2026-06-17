import { describe, it, expect } from "vitest";
import { calcTotalPages, paginateSlice } from "@/lib/pagination";

describe("calcTotalPages", () => {
  it("divides evenly", () => {
    expect(calcTotalPages(8, 4)).toBe(2);
  });

  it("rounds up when items do not fill the last page", () => {
    expect(calcTotalPages(5, 4)).toBe(2);
    expect(calcTotalPages(1, 4)).toBe(1);
  });

  it("returns 0 for an empty list", () => {
    expect(calcTotalPages(0, 4)).toBe(0);
  });

  it("returns 1 when all items fit on one page", () => {
    expect(calcTotalPages(4, 4)).toBe(1);
    expect(calcTotalPages(3, 4)).toBe(1);
  });
});

describe("paginateSlice", () => {
  const items = [0, 1, 2, 3, 4, 5, 6, 7];

  it("returns the first page", () => {
    expect(paginateSlice(items, 1, 4)).toEqual([0, 1, 2, 3]);
  });

  it("returns the second page", () => {
    expect(paginateSlice(items, 2, 4)).toEqual([4, 5, 6, 7]);
  });

  it("returns a partial last page when items do not fill it", () => {
    expect(paginateSlice([0, 1, 2, 3, 4], 2, 4)).toEqual([4]);
  });

  it("returns an empty array for a page beyond the last", () => {
    expect(paginateSlice(items, 3, 4)).toEqual([]);
  });

  it("works with a single item per page", () => {
    expect(paginateSlice([10, 20, 30], 2, 1)).toEqual([20]);
  });
});
