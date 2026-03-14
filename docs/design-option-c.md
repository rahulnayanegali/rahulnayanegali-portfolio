# Design Specification: Option C — Dark-first Developer Blog

## Document Purpose

This document is a complete, self-contained design specification for rebuilding
`rahulnayanegali-portfolio` (the `apps/web` package in the monorepo) around a
**blog-first, dark-accented, developer-identity aesthetic**.  It is written so
that an LLM can read it alone — without access to the codebase — and produce
correct, consistent implementation decisions.

---

## 1. Mental Model

### 1.1 Core Premise

The portfolio's primary route (`/`) is a **blog index**, not a landing page.
The owner's identity is communicated through the act of writing, not through a
hero section with a headshot and bullet-point skills.

### 1.2 Design Personality

| Axis | Value |
|------|-------|
| Tone | Technical, confident, minimal |
| Inspiration | Terminal prompts, GitHub READMEs, Substack dark mode |
| NOT inspired by | Agency portfolios, splash pages, animated SVG heroes |
| Key feeling for the visitor | "This person ships and thinks clearly" |

### 1.3 Single Sentence Description

> A dark-accented blog index where the header band echoes a terminal prompt,
> the latest post gets a full-width featured card, and every subsequent post
> is a compact list row — the design gets denser as you scroll, rewarding
> readers who go deeper.

---

## 2. Existing Codebase Context

> Skip this section if you are starting from scratch.

The following files are directly affected by this redesign. All paths are
relative to `apps/web/src/`.

| File | Current Role | Change |
|------|-------------|--------|
| `App.jsx` | Router shell, ThemeProvider | Keep routing; remove `ThemeProvider` dependency if switching to Tailwind-only theming |
| `header/header.jsx` | Scroll-reactive nav | Extend with terminal prompt styling |
| `components/BlogList.jsx` | Grid of blog cards | Replace with featured + list layout |
| `components/BlogPost.jsx` | Markdown renderer | Minor typography tweaks only |
| `footer/Footer.jsx` | Dark 3-column footer | Keep as-is; already matches the dark palette |
| `archived/Archived.jsx` | About + Tweets + Projects | Keep as the `/archived` route; no change |
| `blogs/blogs.js` | gray-matter markdown loader | No change |
| `theme/theme.jsx` | lightTheme / darkTheme tokens | Extend with new tokens (see Section 6) |

---

## 3. Layout Specification

### 3.1 Page Shell

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER BAND  (always dark, does NOT go white on scroll)    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FEATURED POST CARD  (first/latest blog post)              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ALL POSTS LIST  (remaining posts, compact rows)           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER  (existing component, no change)                   │
└─────────────────────────────────────────────────────────────┘
```

The page background is `bg-gray-50` (light) or `bg-gray-950` (if full dark
mode is implemented). The header band is always `bg-gray-900` — it does NOT
transition to white on scroll (this is a deliberate departure from the current
implementation).

---

### 3.2 Header Band

```
┌─────────────────────────────────────────────────────────────┐
│  > Rahul Nayanegali_          [Archive]   [↗ Resume]        │
│  Frontend Engineer                                          │
└─────────────────────────────────────────────────────────────┘
```

**Anatomy:**

- Left block:
  - Line 1: `> Rahul Nayanegali` followed by a blinking cursor (`_`)
  - Line 2: `Frontend Engineer` in a smaller, muted weight
- Right block: nav links (Archive, Resume)
- The `>` prompt character is decorative — it is `aria-hidden="true"`
- The blinking cursor is a CSS animation (blink 1s step-end infinite)

**Behaviour:**

- On scroll: adds `shadow-lg` and `bg-gray-900/95 backdrop-blur-sm` — it
  stays dark. No white transition.
- Mobile: collapses nav links into a hamburger menu (same as current
  implementation). The identity block (name + title) remains visible.

**Sizing:**
- `py-5` when not scrolled, `py-3` when scrolled
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

---

### 3.3 Featured Post Card

Displayed for `blogs[0]` (the most recent post after date-sort in `blogs.js`).

```
┌─────────────────────────────────────────────────────────────┐
│  ▓ LATEST                                                   │
│                                                             │
│  Portfolio Redesign Plan                    Mar 13, 2026   │
│  ──────────────────────────────────────────────────────     │
│  A complete rethink of how a portfolio should work in       │
│  2026 — with blogs as the center of it. The goal was        │
│  to move away from hero sections and toward writing.        │
│                                                             │
│  [ React ]  [ Architecture ]              5 min  →  Read   │
└─────────────────────────────────────────────────────────────┘
```

**CSS classes (Tailwind):**
```
border-l-4 border-blue-500
bg-white dark:bg-gray-800
rounded-lg
p-8
shadow-sm
hover:shadow-md
transition-shadow duration-200
```

**Internal layout:**

1. **Badge row** — `▓ LATEST` label: `text-xs font-bold tracking-widest
   text-blue-500 uppercase mb-4`
2. **Title + Date row** — flexbox, `justify-between`, `items-baseline`
   - Title: `text-2xl font-bold text-gray-900 dark:text-white`
   - Date: `text-sm text-gray-400`
3. **Divider** — `hr` with `border-gray-200 dark:border-gray-700 my-3`
4. **Excerpt** — `text-gray-600 dark:text-gray-300 leading-relaxed
   line-clamp-3`
5. **Footer row** — flexbox, `justify-between`, `items-center`, `mt-4`
   - Tags: pill chips (see Section 4.1)
   - Read CTA: `text-blue-500 font-medium hover:text-blue-400 flex
     items-center gap-1`

**Excerpt source:** `blog.tldr` from `blogs.js` frontmatter or auto-extracted
`## TLDR` section. The `BlogList` component already has this available.

---

### 3.4 All Posts List

Displayed for `blogs.slice(1)` — every post except the featured one.

```
ALL POSTS ─────────────────────────────────────────────────────

◈  Why Vite changed how I think about DX            Feb 2026
◈  State management in 2025                         Jan 2026
◈  Writing tests you actually want to run           Dec 2025
```

**Section header:**
```
<div class="flex items-center gap-4 my-8">
  <span class="text-xs font-bold tracking-widest text-gray-400 uppercase">
    All Posts
  </span>
  <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
</div>
```

**Each list row:**
```
<a href="/blog/{slug}"
   class="flex items-baseline justify-between py-4
          border-b border-gray-100 dark:border-gray-800
          group hover:border-blue-500
          transition-colors duration-150">

  <div class="flex items-center gap-3">
    <span class="text-blue-500 text-sm" aria-hidden="true">◈</span>
    <span class="text-gray-800 dark:text-gray-100 font-medium
                 group-hover:text-blue-500 transition-colors duration-150">
      {blog.title}
    </span>
  </div>

  <span class="text-sm text-gray-400 shrink-0 ml-4">
    {formatDate(blog.date)}   <!-- "Feb 2026" format -->
  </span>
</a>
```

**Hover behaviour:** the entire row's bottom border transitions from
`border-gray-100` to `border-blue-500`. The title transitions to
`text-blue-500`. No background fill change — the transition is purely
typographic and border-based.

**Empty state:** if `blogs.length === 0`, show:
```
<p class="text-gray-400 text-sm mt-8">No posts yet. Check back soon.</p>
```

---

## 4. Component Details

### 4.1 Tag / Category Chips

Used only on the Featured Card.

```html
<span class="px-2 py-0.5 text-xs font-medium rounded
             bg-gray-100 dark:bg-gray-700
             text-gray-600 dark:text-gray-300
             border border-gray-200 dark:border-gray-600">
  React
</span>
```

Tags come from `blog.tags` frontmatter array. If no tags exist in frontmatter,
chips are omitted entirely — do not fabricate tags.

Frontmatter example that enables tags:
```yaml
---
title: Portfolio Redesign Plan
date: 2026-03-13
tldr: A complete rethink using React, Vite, and a blog-first approach.
tags: [React, Architecture]
---
```

The `blogs.js` loader must be updated to extract `data.tags` alongside
`data.title`, `data.date`, and `data.tldr`.

---

### 4.2 Blinking Cursor

Pure CSS, no JS:

```css
/* In index.css or a module */
.cursor::after {
  content: '_';
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
```

Applied to the name span in the header:
```jsx
<span className="font-bold text-2xl text-white">
  {'>'} Rahul Nayanegali
  <span className="cursor" aria-hidden="true" />
</span>
```

---

### 4.3 Read Time Calculation

Add a utility function to `blogs.js`:

```js
function readTime(markdown) {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)); // 200 wpm average
}
```

Attach to each blog object:
```js
return {
  slug,
  title,
  tldr,
  date,
  tags: data.tags || [],
  readTime: readTime(markdown),
  content: markdown
};
```

Display as: `{blog.readTime} min read`

---

## 5. Typography

| Element | Tailwind Classes |
|---------|-----------------|
| Site name (header) | `font-bold text-2xl md:text-3xl text-white tracking-tight` |
| Site subtitle (header) | `text-sm text-gray-400 mt-0.5` |
| Featured title | `text-2xl md:text-3xl font-bold text-gray-900 dark:text-white` |
| Featured excerpt | `text-base text-gray-600 dark:text-gray-300 leading-relaxed` |
| List row title | `text-base font-medium text-gray-800 dark:text-gray-100` |
| List row date | `text-sm text-gray-400` |
| Section header label | `text-xs font-bold tracking-widest text-gray-400 uppercase` |
| Badge label (LATEST) | `text-xs font-bold tracking-widest text-blue-500 uppercase` |

Font stack: system-ui default (no custom font loaded). This is intentional —
keeps the terminal/native feel and eliminates a network request.

---

## 6. Colour Palette

All colours are Tailwind 3.x utility names. No custom colours needed.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Page background | `gray-50` | `gray-950` | `<main>` |
| Header background | `gray-900` | `gray-900` | Always dark |
| Featured card bg | `white` | `gray-800` | Featured card |
| List row bg | transparent | transparent | List rows |
| List row border | `gray-100` | `gray-800` | Row dividers |
| List row border (hover) | `blue-500` | `blue-500` | Row hover |
| Accent / brand | `blue-500` | `blue-400` | Cursor, ◈, tags, CTA |
| Body text | `gray-900` | `gray-100` | Primary text |
| Muted text | `gray-400` | `gray-500` | Dates, subtitles |
| Featured card border-l | `blue-500` | `blue-500` | Left accent stripe |

---

## 7. Motion & Animation

The design deliberately uses **minimal motion**. Framer Motion is already
installed; use it sparingly.

| Element | Animation | Spec |
|---------|-----------|------|
| Featured card | Fade + slide up on mount | `initial: {opacity:0, y:16}` → `animate: {opacity:1, y:0}` · `duration: 0.4` |
| List rows | Staggered fade in | `delay: index * 0.05` · `duration: 0.3` · cap at 8 items (no stagger after that) |
| Header | None on scroll | Only `shadow-lg` CSS transition — no JS animation |
| Cursor | CSS blink | See Section 4.2 |
| List row hover | CSS only | `transition-colors duration-150` — no JS |

Do not add page transition animations between routes. The blog post page
(`BlogPost.jsx`) already has a simple `opacity 0→1` fade which is sufficient.

---

## 8. Responsive Behaviour

### Mobile (< 768px)

- Header: hamburger menu, identity block (name + title) visible
- Featured card: full width, `p-5` instead of `p-8`, `line-clamp-2` on excerpt
- List rows: date moves below title (stack vertically), `font-size` unchanged
- Tag chips: hidden on mobile featured card to reduce clutter

### Tablet (768px – 1024px)

- Featured card: full width
- List rows: same as desktop

### Desktop (> 1024px)

- `max-w-3xl mx-auto` for the content column — keeps line lengths readable
  (65–75 characters). This is narrower than the current `max-w-7xl` used in
  `BlogList.jsx` and is intentional: blog content should not stretch edge-to-edge.

---

## 9. Routing & Data — No Changes Required

The existing routing in `App.jsx` is correct:

```
/              → BlogList (this redesign)
/blog/:slug    → BlogPost (no change)
/archived      → Archived (no change)
```

The `blogs.js` data loader already handles:
- Raw markdown import via `?raw`
- `gray-matter` frontmatter parsing
- Title extraction fallback (H1 heading)
- TLDR extraction fallback (`## TLDR` section)
- Date-descending sort

Only additions needed in `blogs.js`:
1. Extract `data.tags` (Section 4.1)
2. Compute `readTime` (Section 4.3)

---

## 10. Accessibility

| Concern | Resolution |
|---------|-----------|
| `>` prompt and `◈` bullet | `aria-hidden="true"` on decorative characters |
| Blinking cursor | `aria-hidden="true"` on cursor span; `prefers-reduced-motion` disables the animation |
| Featured card link | Entire card is an `<a>` — use `aria-label="{blog.title}"` |
| List row link | Entire row is an `<a>` — title text is the accessible label |
| Colour contrast | `blue-500` on `white` = 4.6:1 (passes AA); `gray-400` on `white` = 5.1:1 |
| Focus ring | All interactive elements: `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2` |

`prefers-reduced-motion` override:
```css
@media (prefers-reduced-motion: reduce) {
  .cursor::after { animation: none; opacity: 1; }
}
```

---

## 11. Files to Create / Modify

### Modify

| File | What changes |
|------|-------------|
| `header/header.jsx` | Add terminal prompt markup + cursor; remove white-on-scroll class swap |
| `components/BlogList.jsx` | Replace grid with featured card + list layout |
| `blogs/blogs.js` | Add `tags` and `readTime` fields |
| `assets/main.css` or `index.css` | Add `.cursor` blink keyframe |

### Do NOT modify

| File | Reason |
|------|--------|
| `components/BlogPost.jsx` | Already correct |
| `archived/Archived.jsx` | Different route, different design system |
| `footer/Footer.jsx` | Already matches dark palette |
| `App.jsx` | Routing is correct |
| `blogs/PORTFOLIO_REDESIGN_PLAN.md` | Content file, not a UI concern |

---

## 12. Implementation Checklist

Use this list to verify the implementation is complete:

- [ ] Header stays dark on scroll (no white transition)
- [ ] `> Name_` with blinking cursor renders in header
- [ ] `prefers-reduced-motion` disables cursor blink
- [ ] Featured card shows `blogs[0]` with LATEST badge, title, date, excerpt, tags, read time
- [ ] Featured card has left blue border accent (`border-l-4 border-blue-500`)
- [ ] "ALL POSTS" section header with horizontal rule renders
- [ ] List rows show `blogs.slice(1)` with `◈` bullet, title, date
- [ ] List row bottom border turns blue on hover
- [ ] List row title turns blue on hover
- [ ] `◈` and `>` and cursor span have `aria-hidden="true"`
- [ ] All `<a>` elements have visible focus rings
- [ ] Content column is `max-w-3xl` centered
- [ ] Mobile: date stacks below title in list rows
- [ ] Mobile: tag chips hidden on featured card
- [ ] `blogs.js` exports `tags: string[]` and `readTime: number` per post
- [ ] Empty state renders if `blogs.length === 0`
- [ ] Framer Motion stagger capped at 8 items in list
