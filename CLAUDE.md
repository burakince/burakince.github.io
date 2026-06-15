# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Node version

Always use the Node version specified in `.nvmrc` (currently Node 24):

```bash
nvm use
```

## Browser testing

Always use the playwright plugin for browser-based testing and UI verification.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production (runs next-sitemap as postbuild)
npm run lint       # ESLint flat config (core-web-vitals + prettier rules); also runs in CI before build
```

Some issues (TypeScript errors, static export failures, CSS bundling, OG image generation, sitemap) are only visible in the production build and not in `npm run dev`. To verify locally:

```bash
npm run build
npx serve@latest out
```

There is no test suite.

## Before committing

Always run `npm run build` and confirm it succeeds with no errors before committing or pushing.

## Git commits

Never include `Co-Authored-By` or any Claude attribution in commit messages.

## Writing tone

Never finger-point individuals in blog posts. Do not name specific people (support agents, colleagues, vendor employees) when describing problems or negative experiences. Use impersonal phrasing instead: "the support reply," "I was told," "the response explained."

## Architecture

@.claude/rules/architecture.md
@.claude/rules/accessibility.md
@.claude/rules/css.md
@.claude/rules/dependencies.md
