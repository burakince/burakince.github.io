---
title: "Generate Static Web Pages on GitHub with Next.js, Tailwind CSS & Markdown"
excerpt: "A walkthrough for hosting a Next.js and Tailwind CSS site on GitHub Pages, with Markdown-based content and automated deployment via GitHub Actions."
date: "2024-04-25T12:49:07.322Z"
lastModified: "2026-06-16T16:01:35.000Z"
tags:
  - nextjs
  - tailwindcss
  - markdown
  - github-pages
  - static-site
---

Static pages are pre-built at deploy time, so there's no server processing each request. GitHub Pages is free hosting. Next.js handles the static export, and Tailwind CSS handles styling. Here's how to wire it all together.

## What we'll cover

1. Setting up the project
2. Tailwind CSS configuration
3. Configuring Next.js for static export
4. Configuring GitHub Pages deployment

## Step 1: Setting up the project

First, I recommend pinning a specific Node.js version so the project behaves consistently across machines. Install [nvm](https://github.com/nvm-sh/nvm) from the [official page](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) and run:

```bash
echo "v20.12.1" > .nvmrc
nvm install
```

Next, create a new Next.js project:

```bash
npx create-next-app@latest
```

Follow the prompts:

```bash
✔ What is your project named? … my-website
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … No
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

Next.js creates the project structure and includes Tailwind CSS if you selected it above. Move into the project folder:

```bash
cd my-website
```

Then install the extra dependencies:

```bash
npm install markdown-to-jsx gray-matter
npm install @tailwindcss/typography -D
```

## Step 2: Tailwind CSS configuration

In `tailwind.config.ts`, add the typography plugin and point the content path at the `src` directory:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

`src/app/globals.css` also needs Tailwind's base, components, and utilities:

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

In `postcss.config.mjs`, add the Tailwind plugin:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

In `src/app/layout.tsx`, import `globals.css`:

```typescript
import "./globals.css";
```

## Step 3: Configure Next.js for static export

1. In `next.config.mjs`, add the following to produce a static export:

   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     basePath: "",

     output: "export",

     reactStrictMode: true,

     images: {
       unoptimized: true,
     },

     trailingSlash: true,

     skipTrailingSlashRedirect: true,

     // Optional: Change the output directory from `out` to another name such as `dist`
     // distDir: 'dist',
   };

   export default nextConfig;
   ```

2. Create a `_posts` folder in the project root for your Markdown files. Each file needs front matter at the top. Here's an example `lorem-ipsum.md`:

   ```markdown
   ---
   title: "Lorem Ipsum"
   excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus."
   date: "1970-01-01T01:00:00.000Z"
   ---

   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.
   ```

3. Create a `post` folder under `src/app`, then a `[slug]` folder inside it with a `page.tsx` file. This gives you dynamic routing for URLs like `http://localhost:3000/post/lorem-ipsum`, where `lorem-ipsum` is the Markdown filename without the `.md` extension.

4. Use `generateMetadata` and `generateStaticParams` in `src/app/post/[slug]/page.tsx` to read the Markdown files and output static pages:

   ```typescript
   import fs from "fs";
   import matter from "gray-matter";
   import { notFound } from "next/navigation";
   import { Metadata } from "next";
   import { join } from "path";
   import Markdown from "markdown-to-jsx";

   export type Post = {
     slug: string;
     title: string;
     date: string;
     excerpt: string;
     content: string;
   };

   type Params = {
     params: {
       slug: string;
     };
   };

   const postsDirectory = join(process.cwd(), "_posts");

   function getPostSlugs(): string[] {
     return fs.readdirSync(postsDirectory);
   }

   function getPostBySlug(slug: string): Post {
     const realSlug = slug.replace(/\.md$/, "");
     const fullPath = join(postsDirectory, `${realSlug}.md`);
     const fileContents = fs.readFileSync(fullPath, "utf8");
     const { data, content } = matter(fileContents);

     return { ...data, slug: realSlug, content } as Post;
   }

   function getAllPosts(): Post[] {
     const slugs = getPostSlugs();
     const posts = slugs
       .map((slug) => getPostBySlug(slug))
       // Sort posts by date in descending order
       .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
     return posts;
   }

   const PostPage = ({ params }: Params) => {
     const post = getPostBySlug(params.slug);

     if (!post) {
       return notFound();
     }

     return (
       <div>
         <div>
           <h1>{post.title}</h1>
           <div>{post.date}</div>
         </div>
         <article className="prose lg:prose-xl">
           <Markdown>{post.content || ""}</Markdown>
         </article>
       </div>
     );
   };

   export function generateMetadata({ params }: Params): Metadata {
     const post = getPostBySlug(params.slug);

     if (!post) {
       return notFound();
     }

     const title = `${post.title} | My Website`;

     return {
       title,
       openGraph: {
         title,
       },
     };
   }

   export async function generateStaticParams() {
     const posts = getAllPosts();

     return posts.map((post) => ({
       slug: post.slug,
     }));
   }

   export default PostPage;
   ```

The `@tailwindcss/typography` plugin adds default styles for rendered HTML: headings, paragraphs, lists, code blocks. Applying the `prose` class to the wrapper div activates those styles for the Markdown output.

5. Modify `src/app/page.tsx` to list all post titles on the home page:

```typescript
import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import { join } from "path";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
};

const postsDirectory = join(process.cwd(), "_posts");

function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory);
}

function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // Sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

const Home = () => {
  const allPosts = getAllPosts();
  const allPostPreviews = allPosts.map((post) => (
    <div>
    <div>{post.date}</div>
    <Link as={`/post/${post.slug}`} href="/post/[slug]">
      <h2>
        {post.title}
      </h2>
    </Link>
    <p>{post.excerpt}</p>
    </div>
  ));

  return (
    <main>
      <div>
        {allPostPreviews}
      </div>
    </main>
  );
};

export default Home;
```

## Step 4: Configuring GitHub Pages deployment

1. Create `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy Next.js site to Pages

   on:
     push:
       branches: ["main"]

     workflow_dispatch:

   # Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Detect package manager
           id: detect-package-manager
           run: |
             if [ -f "${{ github.workspace }}/yarn.lock" ]; then
               echo "manager=yarn" >> $GITHUB_OUTPUT
               echo "command=install" >> $GITHUB_OUTPUT
               echo "runner=yarn" >> $GITHUB_OUTPUT
               exit 0
             elif [ -f "${{ github.workspace }}/package.json" ]; then
               echo "manager=npm" >> $GITHUB_OUTPUT
               echo "command=ci" >> $GITHUB_OUTPUT
               echo "runner=npx --no-install" >> $GITHUB_OUTPUT
               exit 0
             else
               echo "Unable to determine package manager"
               exit 1
             fi

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: "20"
             cache: ${{ steps.detect-package-manager.outputs.manager }}

         - name: Setup Pages
           uses: actions/configure-pages@v5
           with:
             static_site_generator: next

         - name: Restore cache
           uses: actions/cache@v4
           with:
             path: |
               .next/cache
             key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json', '**/yarn.lock') }}-${{ hashFiles('**.[jt]s', '**.[jt]sx') }}
             restore-keys: |
               ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json', '**/yarn.lock') }}-

         - name: Install dependencies
           run: ${{ steps.detect-package-manager.outputs.manager }} ${{ steps.detect-package-manager.outputs.command }}

         - name: Build with Next.js
           run: ${{ steps.detect-package-manager.outputs.runner }} next build

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./out

     # Deployment job
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

2. Create an SSH deploy key and add it to the repository's Deploy Keys settings.

3. Commit and push. The workflow runs automatically on every push to `main`.

4. Enable GitHub Pages in your repository settings:

   1. Go to **Settings > Pages**.
   2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

5. Once the first deployment completes, the URL for your site appears under **Settings > Pages**.

## Conclusion

You now have a static site built with Next.js, Tailwind CSS, and Markdown, deployed automatically via GitHub Actions. Pagination and tag filtering both work by filtering or slicing the array `getAllPosts()` returns.
