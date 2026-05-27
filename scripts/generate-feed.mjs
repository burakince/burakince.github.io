import { Feed } from "feed";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SITE_URL = "https://www.burakince.com";
const AUTHOR = "Burak Ince";
const EMAIL = "me@burakince.com";
const TITLE = "Burak's Tech Insights: AI, Software, and More";
const DESCRIPTION =
  "Discover the latest in technology, software development, and AI trends with Burak's in-depth analysis and expert insights.";

const feed = new Feed({
  title: TITLE,
  description: DESCRIPTION,
  id: SITE_URL,
  link: SITE_URL,
  language: "en-US",
  image: `${SITE_URL}/assets/open-graph-image.jpg`,
  favicon: `${SITE_URL}/favicon/favicon-32x32.png`,
  copyright: `All rights reserved ${new Date().getFullYear()}, ${AUTHOR}`,
  author: { name: AUTHOR, email: EMAIL, link: `${SITE_URL}/me/` },
  feedLinks: { rss: `${SITE_URL}/feed.xml` },
});

const postsDir = path.join(root, "_posts");
const files = fs.readdirSync(postsDir);

const posts = files
  .map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data } = matter(raw);
    return { slug, ...data };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

for (const post of posts) {
  const url = `${SITE_URL}/post/${post.slug}/`;
  feed.addItem({
    title: post.title,
    id: url,
    link: url,
    description: post.excerpt,
    date: new Date(post.date),
    author: [{ name: AUTHOR, email: EMAIL, link: `${SITE_URL}/me/` }],
  });
}

fs.writeFileSync(path.join(root, "out", "feed.xml"), feed.rss2());
console.log("✅ RSS feed written to out/feed.xml");
