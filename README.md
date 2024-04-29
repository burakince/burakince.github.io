# Blog

The blog posts are stored in `/_posts` as Markdown files with front matter support. Adding a new Markdown file in there will create a new blog post.

The new markdown file must have the following headlines;

```markdown
---
title: "Title"
excerpt: "Description"
date: "1970-01-01T00:00:01.000Z"
keywords:
  - First keyword
  - Second keyword
---
```

## Development

Starts the development server.

```bash
npm run dev
```

Builds the app for production.

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
