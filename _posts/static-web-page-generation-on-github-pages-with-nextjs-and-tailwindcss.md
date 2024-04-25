---
title: "Static Web Page Generation on GitHub Pages with Next.js, Tailwind CSS, and Markdown Content"
excerpt: "Learn how to generate static web pages on GitHub Pages using Next.js, Tailwind CSS, markdown-to-jsx, and the TailwindCSS Typography plugin for a streamlined, efficient web development experience. This guide also includes a step-by-step walkthrough for setting up deployment with GitHub Pages."

date: "2024-04-25T12:49:07.322Z"
---

Static web pages offer excellent performance and low server costs since they are pre-built and don't rely on server-side processing. GitHub Pages provides an easy way to host static websites, and Next.js is a powerful React framework that supports static site generation. Tailwind CSS is a utility-first CSS framework that can help you quickly style your website with a clean, modern look. In this blog post, we'll walk through the process of setting up a static website using Next.js, Tailwind CSS, and GitHub Pages.

## What We'll Cover

1. **Setting Up the Project**
2. **Tailwind CSS Configurations**
3. **Configure Next.js for Static Site Generation**
4. **Configuring GitHub Pages Deployment**
5. **Conclusion**

## Step 1: Setting Up the Project

First, I recommend using a specific Node.js version for your project to maintain consistency. Install [nvm](https://github.com/nvm-sh/nvm) from the [official page](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) and run the following commands to set up your environment:

```bash
echo "v20.12.1" > .nvmrc
nvm install
```

Next, create a new Next.js project:

```bash
npx create-next-app@latest
```

Follow the prompts and answer the questions according to your preferences:

```bash
✔ What is your project named? … my-website
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … No
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

Next.js will create a project structure for you, which you can customize according to your needs. Tailwind CSS should already be included in your project structure. Move to your project folder:

```bash
cd my-website
```

Then install the necessary dependencies:

```bash
npm install markdown-to-jsx gray-matter
npm install @tailwindcss/typography -D
```

## Step 2: Tailwind CSS Configurations

In `tailwind.config.ts`, add the typography plugin and adjust the content path to the `src` directory:

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

In `src/app/globals.css`, Tailwind's base, components, and utilities must be imported:

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

In `postcss.config.mjs`, add the Tailwind CSS plugin to the configuration:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

In `src/app/layout.tsx`, make sure you import the `globals.css` file:

```typescript
import "./globals.css";
```

## Step 3: Configure Next.js for Static Site Generation

To generate a static website, configure your Next.js application to use **Static Site Generation (SSG)**:

1. In your `next.config.mjs`, set the following configurations to generate static pages:

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

2. Create an `_posts` folder in your project root and keep all Markdown-based pages within this folder. Your posts should have attributes at the beginning of each file. Here's an example `lorem-ipsum.md` file:

   ```markdown
   ---
   title: "Lorem Ipsum"
   excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus."
   date: "1970-01-01T01:00:00.000Z"
   ---

   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.
   ```

3. Create a `post` folder under the `src/app` folder, and generate a `[slug]` folder within it. Adding a `page.tsx` file under the `[slug]` folder provides dynamic routing and page functionality for URLs like `http://localhost:3000/post/lorem-ipsum`. In this case, `lorem-ipsum` is your slug, representing the Markdown file name.

4. Use the `generateMetadata` and `generateStaticParams` functions in `src/app/post/[slug]/page.tsx` to fetch Markdown files and generate static content:

   For example, in `src/app/post/[slug]/page.tsx`:

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

The Tailwind CSS Typography plugin is designed to apply clean, typographic styles to your text content, including headers, paragraphs, and lists. It provides consistent and customizable styles for Markdown content.

As shown in the example, the `prose` class is applied to a container div, wrapping the Markdown content. This ensures the typography styles are applied to the rendered Markdown content.

5. Modify the `src/app/page.tsx` file to list all post titles on the main page:

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

## Step 4: Configuring GitHub Pages Deployment

1. Create a new file called `deploy.yml` in the `.github/workflows` folder of your project:

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

2. Create an SSH deploy key for your repository and add it to your GitHub repository's Deploy Keys settings for secure deployment.

3. Commit and push your changes to the repository. The GitHub Actions workflow will automatically build and deploy your static website whenever you push changes to the main branch.

4. Once the deployment is complete, visit your GitHub repository's Settings > Pages to find the URL where your static site is hosted.

## Conclusion

You've now set up a static website using Next.js, Tailwind CSS, markdown-to-jsx, and the TailwindCSS Typography plugin, and deployed it to GitHub Pages. This approach allows you to create performant, beautiful, and efficient static websites with modern tools and workflows. Whether you're creating a blog, portfolio, or documentation site, this setup provides a strong foundation for your projects.
