# Blog

The blog posts are stored in `/_posts` as Markdown files with front matter support. Adding a new Markdown file in there will create a new blog post.

The new markdown file must have the following headlines;

```markdown
---
title: "Title"
excerpt: "Description"
date: "1970-01-01T00:00:01.000Z"
tags:
  - first-tag
  - second-tag
---
```

Always specify the language on code fences (e.g. ` ```typescript `) so syntax highlighting works correctly. The highlight.js CSS is loaded only on post pages (`src/app/post/post.css`) — it is not part of the global bundle.

## Development

This project requires the Node.js version defined in `.nvmrc`. Install [nvm](https://github.com/nvm-sh/nvm) and run:

```bash
nvm use
```

Starts the development server.

```bash
npm run dev
```

Runs the linter (ESLint flat config with Next.js core-web-vitals and prettier rules).

```bash
npm run lint
```

Builds the app for production. Always confirm this passes before committing — some errors (TypeScript, CSS bundling, static export) only surface in the production build.

```bash
npm run build
```

Runs the built app in production mode.

```bash
npx serve@latest out
```

## Dependency Update

To get started, install the `npm-check-updates` package globally:

```bash
npm install -g npm-check-updates
```

Then, run `ncu` to display packages to upgrade.

To upgrade dependencies, you just need to run:

```bash
ncu --upgrade

// or
ncu -u
```

- Red = major
- Cyan = minor
- Green = patch

Interactive mode allows you to select specific packages to update. By default, all packages are selected.

Navigate down through each package and use space to deselect, and enter when you are ready to upgrade all of the selected packages.

```bash
ncu --interactive

// or
ncu -i
```

- Social Share Preview Checker: https://socialsharepreview.com/
- Favicon Generator: https://realfavicongenerator.net/
- Open Graph Review and Generater: https://www.opengraph.xyz/
