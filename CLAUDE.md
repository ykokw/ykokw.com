# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with Astro 6 for ykokw.com. The site aggregates content from multiple sources including local blog posts, external articles, and Zenn feed.

## Development Commands

Use pnpm, not npm (`packageManager: pnpm@10.24.0`; CI also uses pnpm).

- `pnpm dev` - Start development server
- `pnpm dev:host` - Start development server with host access
- `pnpm check` - Type check with `astro check`
- `pnpm build` - Type check with `astro check` and build the site
- `pnpm preview` - Preview the built site
- `pnpm format` - Format code with Prettier
- `pnpm add:post` - Create a new blog post using the script
- `pnpm test` - Run tests with Vitest
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Run tests with UI

## Architecture

### Content System

The site uses Astro's content collections defined in `src/content.config.ts`:

- **blog**: Local markdown files in `./blog/` directory
- **articles**: External articles loaded from `articles/articles.json`
- **zenn**: Posts fetched from Zenn RSS feed at `https://zenn.dev/ykokw/feed`

### Directory Structure

- `src/pages/` - Astro pages and API routes
- `src/components/` - Reusable components
- `src/layouts/` - Page layouts
- `src/contents/` - Content processing logic with TypeScript and tests
- `src/libs/` - Utility libraries
- `src/styles/` - Global styles
- `blog/` - Local blog posts in markdown
- `articles/` - External articles metadata
- `scripts/` - Utility scripts including `add-post.js`

### Tech Stack

- **Framework**: Astro 6 with React integration
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest with coverage reporting
- **Content**: Markdown processing with rehype plugins for external links
- **Node Version**: 24 (specified in package.json)

### Testing

Tests are configured to run on:

- `src/libs/**/*.test.ts`
- `src/contents/**/*.test.ts`

Coverage includes components, contents, layouts, and libs directories.

### Build Process

The build command runs `astro check` for type checking before building, ensuring type safety.
