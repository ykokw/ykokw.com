---
name: proofreading
description: Proofread blog posts in the blog directory, checking writing style consistency, typos, and frontmatter (title and tags). Use when the user asks to proofread, review, or polish a blog post draft.
argument-hint: "[file]"
---

Proofread blog posts in the `blog/` directory.

1. Find the target file:
   - If a file is specified as an argument, use it (even if it is staged).
   - Otherwise, look for unstaged markdown files in the `blog/` directory (`git status` / `git diff`).
2. Identify and point out inconsistencies in writing style and typos, then edit the file to fix them.
3. Include frontmatter data in the proofreading process and verify that the title and tags are appropriate for the content.
