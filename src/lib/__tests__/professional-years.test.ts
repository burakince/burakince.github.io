import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { calculateYears } from "@/lib/professional-years";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("calculateYears", () => {
  it("returns 0 on the exact start date", () => {
    vi.setSystemTime(new Date(2012, 6, 1)); // July 1, 2012
    expect(calculateYears({ year: 2012, month: 7 })).toBe(0);
  });

  it("returns correct years on the anniversary month", () => {
    vi.setSystemTime(new Date(2026, 6, 1)); // July 1, 2026
    expect(calculateYears({ year: 2012, month: 7 })).toBe(14);
  });

  it("returns correct years after the anniversary month", () => {
    vi.setSystemTime(new Date(2026, 7, 15)); // August 15, 2026
    expect(calculateYears({ year: 2012, month: 7 })).toBe(14);
  });

  it("does not count a year when the anniversary month has not arrived yet", () => {
    vi.setSystemTime(new Date(2026, 5, 30)); // June 30, 2026 — before July
    expect(calculateYears({ year: 2012, month: 7 })).toBe(13);
  });

  it("returns 0 for a full year not yet completed", () => {
    vi.setSystemTime(new Date(2013, 5, 30)); // June 30, 2013 — 11 months in
    expect(calculateYears({ year: 2012, month: 7 })).toBe(0);
  });

  it("handles a January start date", () => {
    vi.setSystemTime(new Date(2026, 0, 1)); // January 1, 2026
    expect(calculateYears({ year: 2001, month: 1 })).toBe(25);
  });

  it("handles a December start date", () => {
    vi.setSystemTime(new Date(2026, 11, 1)); // December 1, 2026
    expect(calculateYears({ year: 2001, month: 12 })).toBe(25);
  });

  it("returns 0 before the anniversary month in the first year", () => {
    vi.setSystemTime(new Date(2001, 10, 1)); // November 2001, start was December 2001
    expect(calculateYears({ year: 2001, month: 12 })).toBe(0);
  });
});
