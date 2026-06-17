import { test, expect } from "playwright/test";

test("homepage loads with visible posts", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Burak's Tech Insights: AI, Software, and More");
  await expect(page.locator("h1")).toContainText("Latest Posts");
  await expect(page.locator("a[href*='/post/']").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Latest Posts" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tags" })).toBeVisible();
  await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  await expect(page.locator("footer")).toContainText("Burak Ince");
});

test("tags index loads with visible tags", async ({ page }) => {
  await page.goto("/tag/");
  await expect(page.locator("h1")).toContainText("Tags");
  await expect(page.locator("main a").first()).toBeVisible();
});

test("about page loads with name and key sections", async ({ page }) => {
  await page.goto("/me/");
  await expect(page.locator("h1")).toContainText("Burak Ince");
  await expect(page.getByRole("heading", { name: /skills/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /experience/i }).first()).toBeVisible();
});

test("blog post loads with content and tags", async ({ page }) => {
  await page.goto("/post/how-to-use-a-custom-domain-with-github-pages/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("article")).toBeVisible();
  await expect(page.locator("article")).not.toBeEmpty();
  await expect(page.locator("main a[href^='/tag/']").first()).toBeVisible();
});

test("RSS feed is served and contains feed markup", async ({ page }) => {
  const response = await page.goto("/feed.xml");
  expect(response?.status()).toBe(200);
  const body = await page.content();
  expect(body.toLowerCase()).toMatch(/<rss|<feed/);
});

test("page 2 pagination loads with posts", async ({ page }) => {
  await page.goto("/page/2/");
  const response = await page.goto("/page/2/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("a[href*='/post/']").first()).toBeVisible();
});
