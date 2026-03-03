---
title: Why This Site
excerpt: Why we chose an OS-style web architecture for department content.
sort_order: 1
card_title: Why This Site
card_excerpt: Why the department site uses an OS-style model with fast, flexible content workflows.
card_badge: Editorial
card_variant: feature
---

## Why This Site

Most department websites force a one-page-at-a-time workflow: you open something, lose context, go back, then repeat.

This site takes a different approach. It treats navigation like a lightweight workspace, while still behaving like a normal website.

### What We Wanted To Fix

- Context loss when moving between articles, staff pages, and programme information.
- Slow, rigid publishing workflows where content and interface are tightly coupled.
- “Either/or” UX choices where power users lose browser features to gain app-style interaction.

### Core Idea

Use a URL-driven SPA with persistent app windows:

- URL chooses the focused app and subroute.
- Open apps stay mounted until explicitly closed.
- Content is authored in markdown and compiled at build time.
- Browser behavior (history, tabs, links) remains first-class.

In practice, this means one tab can function like a complete workspace, while multiple browser tabs still work naturally for advanced workflows.

### Try It In 60 Seconds

1. Open [Home](/home), [Staff](/people/staff), and [Articles Overview](/reader/overview).
2. Move between them using the sidebar and top navigation.
3. Open an article like [Why This Site](/reader/articles/why-this-site), then open another article.
4. Use Back/Forward and notice that navigation restores app identity and focus, not destructive snapshots.
5. Keep multiple windows open and continue where you left off.

### Why This Model Works

- **Fast interaction:** no full page reload for normal in-site navigation.
- **Structured content pipeline:** content lives in versioned markdown files.
- **Flexible UI:** app shells are normal Svelte components, so behavior is programmable.
- **Predictable routing:** links stay readable and shareable.

### Power Users Are Not Penalized

The goal is not to replace browser tabs. The goal is to make each tab more capable.

If you prefer a single focused workspace, this model gives you that.
If you prefer several browser tabs and parallel workflows, that still works exactly as expected.

### Trade-Offs (Explicitly)

- Content changes ship on deploy, not as live CMS edits.
- History restores route identity and app focus, not historical content snapshots.
- The architecture is intentionally opinionated: stable behavior over hidden magic.
