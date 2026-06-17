import { describe, it, expect } from "vitest";
import {
  SKILL_CATEGORIES,
  SKILL_CATEGORIES_SORTED,
  ALL_SKILLS_SORTED,
  CORE_CONCEPTS,
} from "@/lib/skills";

describe("SKILL_CATEGORIES_SORTED", () => {
  it("has the same number of categories as SKILL_CATEGORIES", () => {
    expect(SKILL_CATEGORIES_SORTED.length).toBe(SKILL_CATEGORIES.length);
  });

  it("is non-empty", () => {
    expect(SKILL_CATEGORIES_SORTED.length).toBeGreaterThan(0);
  });

  it("preserves category labels", () => {
    const original = SKILL_CATEGORIES.map((c) => c.label);
    const sorted = SKILL_CATEGORIES_SORTED.map((c) => c.label);
    expect(sorted).toEqual(original);
  });

  it("items within each category are sorted alphabetically (locale en)", () => {
    for (const { label, items } of SKILL_CATEGORIES_SORTED) {
      for (let i = 0; i < items.length - 1; i++) {
        const cmp = items[i].localeCompare(items[i + 1], "en");
        expect(cmp, `"${items[i]}" should come before "${items[i + 1]}" in category "${label}"`).toBeLessThanOrEqual(0);
      }
    }
  });
});

describe("ALL_SKILLS_SORTED", () => {
  it("is non-empty", () => {
    expect(ALL_SKILLS_SORTED.length).toBeGreaterThan(0);
  });

  it("is sorted alphabetically (locale en)", () => {
    for (let i = 0; i < ALL_SKILLS_SORTED.length - 1; i++) {
      const cmp = ALL_SKILLS_SORTED[i].localeCompare(ALL_SKILLS_SORTED[i + 1], "en");
      expect(cmp, `"${ALL_SKILLS_SORTED[i]}" should come before "${ALL_SKILLS_SORTED[i + 1]}"`).toBeLessThanOrEqual(0);
    }
  });

  it("has no duplicates", () => {
    const unique = new Set(ALL_SKILLS_SORTED);
    expect(unique.size).toBe(ALL_SKILLS_SORTED.length);
  });

  it("includes all CORE_CONCEPTS", () => {
    for (const concept of CORE_CONCEPTS) {
      expect(ALL_SKILLS_SORTED, `Expected ALL_SKILLS_SORTED to include core concept "${concept}"`).toContain(concept);
    }
  });

  it("includes spot-checked skills from categories", () => {
    expect(ALL_SKILLS_SORTED).toContain("TypeScript");
    expect(ALL_SKILLS_SORTED).toContain("Kubernetes");
    expect(ALL_SKILLS_SORTED).toContain("PostgreSQL");
  });
});
