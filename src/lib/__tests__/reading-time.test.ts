import { describe, it, expect } from "vitest";
import { readingTime } from "@/lib/reading-time";

function words(n: number): string {
  return Array(n).fill("word").join(" ");
}

describe("readingTime", () => {
  it("returns 1 for empty string (minimum)", () => {
    expect(readingTime("")).toBe(1);
  });

  it("returns 1 for whitespace-only content (minimum)", () => {
    expect(readingTime("   \t\n  ")).toBe(1);
  });

  it("returns 1 for a single word", () => {
    expect(readingTime("hello")).toBe(1);
  });

  it("returns 1 for exactly 200 words", () => {
    expect(readingTime(words(200))).toBe(1);
  });

  it("returns 1 for 201 words (rounds to 1 due to floating point)", () => {
    // Math.round(201/200) = Math.round(1.005) → 1 (float precision)
    expect(readingTime(words(201))).toBe(1);
  });

  it("returns 2 for 300 words", () => {
    // Math.round(300/200) = Math.round(1.5) = 2
    expect(readingTime(words(300))).toBe(2);
  });

  it("returns 2 for 400 words", () => {
    expect(readingTime(words(400))).toBe(2);
  });

  it("returns 3 for 600 words", () => {
    expect(readingTime(words(600))).toBe(3);
  });

  it("handles mixed whitespace (tabs and newlines) as word delimiters", () => {
    const content = "word1\tword2\nword3\r\nword4";
    expect(readingTime(content)).toBe(1);
  });
});
