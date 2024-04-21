# Blog

The blog posts are stored in `/_posts` as Markdown files with front matter support. Adding a new Markdown file in there will create a new blog post.

To create the blog posts we use [`markdown-to-jsx`](https://github.com/quantizor/markdown-to-jsx) to convert the Markdown files into an HTML string, and then send it down as a prop to the page. Markdown styles handled by [`tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography) tailwindcss plugin. The metadata of every post is handled by [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and also sent in props to the page.

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
