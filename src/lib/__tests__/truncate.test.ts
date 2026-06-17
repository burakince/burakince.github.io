import { describe, it, expect } from "vitest";
import { smartTruncate } from "@/lib/truncate";

describe("smartTruncate", () => {
  it("returns short text unchanged", () => {
    const text = "Hello world";
    expect(smartTruncate(text)).toBe(text);
  });

  it("returns text at exact default limit unchanged", () => {
    const text = "a".repeat(150);
    expect(smartTruncate(text)).toBe(text);
  });

  it("default maxChars is 150", () => {
    const text = "a".repeat(151);
    expect(smartTruncate(text)).toContain("…");
    expect(smartTruncate(text, 150)).toBe(smartTruncate(text));
  });

  it("empty string returns empty string", () => {
    expect(smartTruncate("")).toBe("");
  });

  it("cuts at sentence boundary (period) at or after 50% mark", () => {
    // Period at index 80, minCut = 75 — should cut after the period
    const text = "a".repeat(80) + ". " + "b".repeat(100);
    const result = smartTruncate(text);
    expect(result).toBe("a".repeat(80) + "." + "…");
  });

  it("cuts at sentence boundary (exclamation) at or after 50% mark", () => {
    const text = "a".repeat(80) + "! " + "b".repeat(100);
    const result = smartTruncate(text);
    expect(result).toBe("a".repeat(80) + "!" + "…");
  });

  it("cuts at sentence boundary (question) at or after 50% mark", () => {
    const text = "a".repeat(80) + "? " + "b".repeat(100);
    const result = smartTruncate(text);
    expect(result).toBe("a".repeat(80) + "?" + "…");
  });

  it("cuts at comma when no sentence boundary exists in range", () => {
    // No period/!/? in text, comma at index 80
    const text = "a".repeat(80) + ", " + "b".repeat(100);
    const result = smartTruncate(text);
    expect(result).toBe("a".repeat(80) + "," + "…");
  });

  it("cuts at semicolon when no sentence boundary or comma exists in range", () => {
    const text = "a".repeat(80) + "; " + "b".repeat(100);
    const result = smartTruncate(text);
    expect(result).toBe("a".repeat(80) + ";" + "…");
  });

  it("ignores sentence boundary below the 50% mark", () => {
    // Period at index 30 (below minCut=75), last space is inside ". " at index 31
    const text = "a".repeat(30) + ". " + "b".repeat(200);
    const result = smartTruncate(text);
    // Falls through to word boundary: space at index 31
    expect(result).toBe("a".repeat(30) + "." + "…");
  });

  it("cuts at last space when no punctuation boundary found in range", () => {
    // 32 repetitions of "word " = 160 chars, no punctuation
    const text = "word ".repeat(32);
    const result = smartTruncate(text);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(151); // 150 chars + ellipsis char
  });

  it("cuts at maxChars when no spaces exist", () => {
    const text = "a".repeat(200);
    expect(smartTruncate(text)).toBe("a".repeat(150) + "…");
  });

  it("respects custom maxChars", () => {
    const text = "a".repeat(60);
    expect(smartTruncate(text, 50)).toBe("a".repeat(50) + "…");
  });
});
