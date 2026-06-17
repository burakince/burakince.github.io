import { test, expect, type Page } from "playwright/test";

type Schema = Record<string, unknown>;

async function getSchemas(page: Page): Promise<Schema[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').all();
  const texts = await Promise.all(scripts.map((s) => s.textContent()));
  return texts
    .filter((t): t is string => t !== null)
    .map((t) => JSON.parse(t));
}

function findSchema(schemas: Schema[], type: string): Schema | undefined {
  return schemas.find((s) => s["@type"] === type);
}

// ─── Homepage ────────────────────────────────────────────────────────────────

test("homepage JSON-LD: WebSite and Blog schemas are present", async ({ page }) => {
  await page.goto("/");
  const schemas = await getSchemas(page);
  expect(findSchema(schemas, "WebSite")).toBeDefined();
  expect(findSchema(schemas, "Blog")).toBeDefined();
});

test("homepage JSON-LD: ItemList has BlogPosting items with required fields", async ({ page }) => {
  await page.goto("/");
  const schemas = await getSchemas(page);

  const itemList = findSchema(schemas, "ItemList");
  expect(itemList).toBeDefined();

  const items = itemList!.itemListElement as Schema[];
  expect(items.length).toBeGreaterThan(0);

  const first = items[0];
  expect(first["@type"]).toBe("ListItem");
  expect(first.position).toBe(1);

  const posting = first.item as Schema;
  expect(posting["@type"]).toBe("BlogPosting");
  expect(posting.headline).toBeTruthy();
  expect(posting.datePublished).toBeTruthy();
  expect(posting.dateModified).toBeTruthy();
  expect((posting.author as Schema).name).toBeTruthy();

  // og-generator saves images with underscores — slug.replace(/-/g, "_")
  const imageUrl = posting.image as string;
  expect(imageUrl).toContain("/og-images/");
  const filename = imageUrl.split("/og-images/")[1];
  expect(filename).not.toContain("-");
});

// ─── Post page ───────────────────────────────────────────────────────────────

const POST_SLUG = "how-to-use-a-custom-domain-with-github-pages";

test("post page JSON-LD: BlogPosting has required Article fields", async ({ page }) => {
  await page.goto(`/post/${POST_SLUG}/`);
  const schemas = await getSchemas(page);

  const posting = findSchema(schemas, "BlogPosting");
  expect(posting).toBeDefined();
  expect(posting!.headline).toBeTruthy();
  expect(posting!.image).toBeTruthy();
  expect(posting!.datePublished).toBeTruthy();
  expect(posting!.dateModified).toBeTruthy();
  expect(posting!.description).toBeTruthy();
  const author = posting!.author as Schema;
  expect(author.name).toBeTruthy();
  expect(author["@id"]).toBeTruthy();
});

test("post page JSON-LD: BreadcrumbList has name and two well-formed items", async ({ page }) => {
  await page.goto(`/post/${POST_SLUG}/`);
  const schemas = await getSchemas(page);

  const breadcrumb = findSchema(schemas, "BreadcrumbList");
  expect(breadcrumb).toBeDefined();

  // Container must have a name — without it the Rich Results Test shows "unnamed item"
  expect(breadcrumb!.name).toBeTruthy();

  const items = breadcrumb!.itemListElement as Schema[];
  expect(items).toHaveLength(2);

  const home = items[0];
  expect(home.position).toBe(1);
  expect(home.name).toBe("Home");
  const homeWebPage = home.item as Schema;
  expect(homeWebPage["@type"]).toBe("WebPage");
  expect(homeWebPage["@id"]).toBeTruthy();
  expect(homeWebPage.name).toBe("Home");

  const postItem = items[1];
  expect(postItem.position).toBe(2);
  expect(postItem.name).toBeTruthy();
  const postWebPage = postItem.item as Schema;
  expect(postWebPage["@type"]).toBe("WebPage");
  expect(String(postWebPage["@id"])).toContain("/post/");
  expect(postWebPage.name).toBeTruthy();
});

// ─── Tags index page ─────────────────────────────────────────────────────────

test("tags index JSON-LD: BreadcrumbList has 2-level trail Home > Tags", async ({ page }) => {
  await page.goto("/tag/");
  const schemas = await getSchemas(page);

  const breadcrumb = findSchema(schemas, "BreadcrumbList");
  expect(breadcrumb).toBeDefined();
  expect(breadcrumb!.name).toBeTruthy();

  const items = breadcrumb!.itemListElement as Schema[];
  expect(items).toHaveLength(2);

  expect(items[0].position).toBe(1);
  expect(items[0].name).toBe("Home");
  const tagsIndexHome = items[0].item as Schema;
  expect(tagsIndexHome["@type"]).toBe("WebPage");
  expect(tagsIndexHome.name).toBe("Home");

  expect(items[1].position).toBe(2);
  expect(items[1].name).toBe("Tags");
  const tagsIndexLeaf = items[1].item as Schema;
  expect(tagsIndexLeaf["@type"]).toBe("WebPage");
  expect(String(tagsIndexLeaf["@id"])).toContain("/tag");
  expect(tagsIndexLeaf.name).toBe("Tags");
});

// ─── Tag page ────────────────────────────────────────────────────────────────

test("tag page JSON-LD: ItemList has BlogPosting items with required fields", async ({ page }) => {
  await page.goto("/tag/ai/");
  const schemas = await getSchemas(page);

  const itemList = findSchema(schemas, "ItemList");
  expect(itemList).toBeDefined();
  expect(itemList!.name).toBeTruthy();

  const items = itemList!.itemListElement as Schema[];
  expect(items.length).toBeGreaterThan(0);

  const first = items[0];
  expect(first["@type"]).toBe("ListItem");
  expect(first.position).toBe(1);

  const posting = first.item as Schema;
  expect(posting["@type"]).toBe("BlogPosting");
  expect(posting.headline).toBeTruthy();
  expect(posting.datePublished).toBeTruthy();
  expect(posting.dateModified).toBeTruthy();
  expect((posting.author as Schema).name).toBeTruthy();
  const imageUrl = posting.image as string;
  expect(imageUrl).toContain("/og-images/");
  expect(imageUrl.split("/og-images/")[1]).not.toContain("-");
});

test("tag page JSON-LD: BreadcrumbList has 3-level trail Home > Tags > #tag", async ({ page }) => {
  await page.goto("/tag/ai/");
  const schemas = await getSchemas(page);

  const breadcrumb = findSchema(schemas, "BreadcrumbList");
  expect(breadcrumb).toBeDefined();
  expect(breadcrumb!.name).toBeTruthy();

  const items = breadcrumb!.itemListElement as Schema[];
  expect(items).toHaveLength(3);

  expect(items[0].position).toBe(1);
  expect(items[0].name).toBe("Home");
  const tagHome = items[0].item as Schema;
  expect(tagHome["@type"]).toBe("WebPage");
  expect(tagHome.name).toBe("Home");

  expect(items[1].position).toBe(2);
  expect(items[1].name).toBe("Tags");
  const tagMiddle = items[1].item as Schema;
  expect(tagMiddle["@type"]).toBe("WebPage");
  expect(String(tagMiddle["@id"])).toContain("/tag");
  expect(tagMiddle.name).toBe("Tags");

  expect(items[2].position).toBe(3);
  expect(String(items[2].name).startsWith("#")).toBe(true);
  const tagLeaf = items[2].item as Schema;
  expect(tagLeaf["@type"]).toBe("WebPage");
  expect(String(tagLeaf["@id"])).toContain("/tag/");
  expect(String(tagLeaf.name).startsWith("#")).toBe(true);
});

// ─── Paginated listing page ───────────────────────────────────────────────────

test("paginated page JSON-LD: BreadcrumbList has 2-level trail Home > Page N", async ({ page }) => {
  await page.goto("/page/2/");
  const schemas = await getSchemas(page);

  const breadcrumb = findSchema(schemas, "BreadcrumbList");
  expect(breadcrumb).toBeDefined();
  expect(breadcrumb!.name).toBeTruthy();

  const items = breadcrumb!.itemListElement as Schema[];
  expect(items).toHaveLength(2);

  expect(items[0].position).toBe(1);
  expect(items[0].name).toBe("Home");
  const paginatedHome = items[0].item as Schema;
  expect(paginatedHome["@type"]).toBe("WebPage");
  expect(paginatedHome.name).toBe("Home");

  expect(items[1].position).toBe(2);
  expect(items[1].name).toBe("Page 2");
  const paginatedLeaf = items[1].item as Schema;
  expect(paginatedLeaf["@type"]).toBe("WebPage");
  expect(String(paginatedLeaf["@id"])).toContain("/page/2");
  expect(paginatedLeaf.name).toBe("Page 2");
});

// ─── About page ──────────────────────────────────────────────────────────────

test("about page JSON-LD: BreadcrumbList has 2-level trail Home > About", async ({ page }) => {
  await page.goto("/me/");
  const schemas = await getSchemas(page);

  const breadcrumb = findSchema(schemas, "BreadcrumbList");
  expect(breadcrumb).toBeDefined();
  expect(breadcrumb!.name).toBeTruthy();

  const items = breadcrumb!.itemListElement as Schema[];
  expect(items).toHaveLength(2);

  expect(items[0].position).toBe(1);
  expect(items[0].name).toBe("Home");
  const aboutHome = items[0].item as Schema;
  expect(aboutHome["@type"]).toBe("WebPage");
  expect(aboutHome.name).toBe("Home");

  expect(items[1].position).toBe(2);
  expect(items[1].name).toBe("About");
  const aboutLeaf = items[1].item as Schema;
  expect(aboutLeaf["@type"]).toBe("WebPage");
  expect(String(aboutLeaf["@id"])).toContain("/me");
  expect(aboutLeaf.name).toBe("About");
});

test("about page JSON-LD: ProfilePage has Person mainEntity with key fields", async ({ page }) => {
  await page.goto("/me/");
  const schemas = await getSchemas(page);

  const profilePage = findSchema(schemas, "ProfilePage");
  expect(profilePage).toBeDefined();

  const person = profilePage!.mainEntity as Schema;
  expect(person["@type"]).toBe("Person");
  expect(person["@id"]).toBeTruthy();
  expect(person.name).toBeTruthy();
  expect(person.jobTitle).toBeTruthy();
  expect(Array.isArray(person.sameAs)).toBe(true);
  expect((person.sameAs as string[]).length).toBeGreaterThan(0);
});
