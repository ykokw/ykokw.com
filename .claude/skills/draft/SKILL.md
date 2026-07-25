---
name: draft
description: Create a draft for a technical blog post from notes on unstaged files in the blog directory. Use when the user asks to draft, write, or expand a blog post from notes.
argument-hint: "[file]"
---

Create a draft for a technical blog post from notes on unstaged files.

1. Find the target file:
   - If a file is specified as an argument, use it (even if it is staged).
   - Otherwise, look for unstaged markdown files in the `blog/` directory (`git status` / `git diff`).
2. Expand the notes in the target file into a blog post draft, keeping the author's voice and intent.
3. Edit the target file with user confirmation before applying changes.
4. If there is any content you think should be added (missing context, examples, diagrams, references), suggest it to the user.
