# React Migration Plan — Dark Blog Design
## From: `docs/design-option-c-demo-dark.html` → `apps/web/src/`

---

## Purpose of This Document

This document is written for an LLM session that has access to the monorepo
but may NOT have seen the design HTML file. It contains:

1. A complete design token extraction from the finalized HTML
2. A component decomposition map (HTML → React)
3. A sprint-by-sprint migration plan using trunk-based development
4. TDD requirements per component
5. Exact constraints the implementer must not deviate from

Feed this document as the first message in a new Claude session, then issue
implementation tasks sprint by sprint.

---

## 1. Source of Truth

The reference design is `docs/design-option-c-demo-dark.html` (375 lines).
It is a single static HTML file with inline styles and no JavaScript (only
HTML `onmouseover`/`onmouseout` attribute handlers for hover). Everything
below is extracted directly from it.

---

## 2. Design Token Extraction

These are the exact values used in the HTML. When writing Tailwind classes or
CSS variables, map to these — do not substitute.

### 2.1 Colours

| Token name        | Hex / rgba value                        | Used on |
|-------------------|-----------------------------------------|---------|
| `page-bg`         | `#0d1117`                               | `<body>` background |
| `dot-grid`        | `rgba(255,255,255,0.03)` 1px dot        | background-image radial-gradient, 32px grid |
| `header-bg`       | `rgba(13,17,23,0.85)` + blur(12px)      | sticky header |
| `header-border`   | `rgba(255,255,255,0.06)`                | header bottom border |
| `card-bg`         | `#161b22`                               | featured card background |
| `card-border`     | `rgba(255,255,255,0.07)`                | featured card 1px border |
| `card-border-l`   | `#3b82f6` 3px solid                     | featured card left accent |
| `card-hover-ring` | `rgba(59,130,246,0.15)` + shadow        | featured card hover box-shadow |
| `row-border`      | `rgba(255,255,255,0.05)`                | list row bottom border |
| `row-border-hover`| `rgba(59,130,246,0.4)`                  | list row hover border |
| `divider`         | `rgba(255,255,255,0.07)`                | hr inside card, "All Posts" rule |
| `accent`          | `#3b82f6`                               | `>` prompt, `◈`, badge, card-border-l, Read CTA, hover states |
| `text-primary`    | `#e6edf3`                               | body color, nav name, card title |
| `text-secondary`  | `#c9d1d9`                               | list row titles |
| `text-muted`      | `#8b949e`                               | dates, subtitle, excerpt, tags, nav Archive link |
| `text-faint`      | `#30363d`                               | separator dot `·` between read-time and Read |
| `resume-border`   | `rgba(255,255,255,0.15)`                | Resume button default border |
| `resume-border-h` | `rgba(59,130,246,0.6)`                  | Resume button hover border |

### 2.2 Typography

| Element | Font family | Weight | Size | Letter-spacing | Line-height |
|---------|-------------|--------|------|----------------|-------------|
| Body / global | `Inter`, system-ui | 400 | — | — | — |
| Name `> Rahul Nayanegali_` | `Space Mono` | 700 | 1.15rem | -0.02em | — |
| Subtitle `Frontend Engineer` | `Space Mono` | 400 | 0.75rem | 0.03em | — |
| Nav `Archive` link | Inter | 400 | 0.82rem | 0.02em | — |
| Nav `Resume` button | Inter | 600 | 0.78rem | 0.03em | — |
| Badge `▓ LATEST` | `Space Mono` | 700 | 0.62rem | 0.14em | — |
| Featured title `<h2>` | Inter | 700 | 1.3rem | -0.02em | 1.3 |
| Featured date | `Space Mono` | 400 | 0.78rem | — | — |
| Excerpt `<p>` | Inter | 400 | 0.9rem | — | 1.75 |
| Tag chips | `Space Mono` | 500 | 0.68rem | 0.02em | — |
| Read CTA | Inter | 600 | 0.82rem | — | — |
| Read-time `5 min` | `Space Mono` | 400 | 0.75rem | — | — |
| `ALL POSTS` label | `Space Mono` | 700 | 0.62rem | 0.14em | — |
| List row title `.rt` | Inter | 500 | 0.92rem | — | — |
| List row date | `Space Mono` | 400 | 0.75rem | — | — |
| `◈` bullet | `Space Mono` | 400 | 0.75rem | — | — |

**Font loading:** Google Fonts via two `<link preconnect>` + one stylesheet
link. Import both `Inter` (400,500,700) and `Space Mono` (400,700).

### 2.3 Spacing & Layout

| Property | Value |
|----------|-------|
| Content max-width | `48rem` (768px) — applies to both header inner div and `<main>` |
| Content horizontal padding | `24px` (mobile), same on desktop |
| Main top padding | `52px` |
| Main bottom padding | `100px` |
| Header vertical padding | `18px 0` |
| Featured card padding | `28px 32px` |
| Featured card border-radius | `10px` |
| Featured card border-left width | `3px` |
| Card hover box-shadow | `0 0 0 1px rgba(59,130,246,0.15), 0 8px 32px rgba(0,0,0,0.4)` |
| Card transition | `border-color 0.2s, box-shadow 0.2s` |
| Badge margin-bottom | `14px` |
| HR margin | `14px 0` |
| Footer row margin-top | `20px` |
| Tag chip padding | `3px 10px` |
| Tag chip border-radius | `4px` |
| "All Posts" section margin-top | `44px` |
| List row padding | `18px 0` |
| List row gap (title ↔ date) | `16px` |
| `◈` to title gap | `12px` |
| Nav gap (Archive ↔ Resume) | `24px` |
| Resume button padding | `6px 14px`, border-radius `6px` |
| Dot grid size | `32px 32px` |
| Dot size | `1px` |
| Header z-index | `100` |

### 2.4 Animations

| Name | Definition | Applied to |
|------|-----------|------------|
| `blink` | `0%,100% opacity:1; 50% opacity:0` · `1s step-end infinite` | `.cursor` span |
| `prefers-reduced-motion` | `.cursor { animation:none; opacity:1 }` | overrides blink |
| Card hover | CSS transition `border-color 0.2s, box-shadow 0.2s` | featured card `<a>` |
| Resume hover | CSS transition `border-color 0.15s` | Resume `<a>` |
| List row hover | instant (no transition) — JS sets border-bottom and title colour | list `<a>` rows |

---

## 3. Component Decomposition

The HTML maps to exactly 5 React components plus 1 Tailwind config update
and 1 global CSS addition.

```
App.jsx
├── Header                   ← apps/web/src/header/header.jsx      (MODIFY)
└── main (route outlet)
    └── BlogList             ← apps/web/src/components/BlogList.jsx (REPLACE)
        ├── FeaturedCard     ← apps/web/src/components/FeaturedCard.jsx (NEW)
        │   └── TagChip      ← apps/web/src/components/TagChip.jsx      (NEW)
        └── PostRow          ← apps/web/src/components/PostRow.jsx       (NEW)
```

### 3.1 `Header` — MODIFY existing `header/header.jsx`

**What changes:**
- Remove white-on-scroll class swap. Header stays dark always:
  `background: rgba(13,17,23,0.85)` + `backdrop-filter: blur(12px)`
- Replace name markup with terminal prompt structure:
  ```jsx
  <span aria-hidden="true" className="text-blue-500 font-mono">&gt;</span>
  <span className="font-mono font-bold">Rahul Nayanegali</span>
  <span aria-hidden="true" className="cursor font-mono text-blue-500">_</span>
  ```
- Add `Frontend Engineer` subtitle in Space Mono below name
- Resume button: change from filled white to outline style
  (`border border-white/15`, transparent bg, hover border-blue-500/60)
- Nav link colour: `#8b949e` default, `#e6edf3` hover

**What does NOT change:**
- Mobile hamburger menu logic
- Route-aware nav links (Archive vs Home links)
- Framer Motion entrance animation on the logo block (keep or remove — low priority)

**Props:** none (self-contained)

---

### 3.2 `BlogList` — REPLACE entirely

**Current:** 3-column responsive grid of cards.
**New:** featured card (first post) + section divider + list rows (remaining posts).

```jsx
const BlogList = () => {
  if (blogs.length === 0) return <EmptyState />;
  const [featured, ...rest] = blogs;  // blogs already sorted date-desc
  return (
    <div className="max-w-3xl mx-auto px-6 py-[52px] pb-[100px]">
      <FeaturedCard blog={featured} />
      <AllPostsHeader />
      {rest.map((blog, i) => <PostRow key={blog.slug} blog={blog} index={i} />)}
    </div>
  );
};
```

**Props:** none (reads from `blogs` import directly)

---

### 3.3 `FeaturedCard` — NEW

**HTML source:** lines 134–266 of the reference HTML.

```jsx
// Props shape
{
  blog: {
    slug: string,       // used in href="/blog/{slug}"
    title: string,
    date: Date,
    tldr: string,       // shown as excerpt, line-clamp-3
    tags: string[],     // optional array, chips only shown if non-empty
    readTime: number    // integer minutes
  }
}
```

**Structure:**
```
<a href="/blog/{slug}">          ← entire card is the link
  <Badge>▓ LATEST</Badge>
  <div flex justify-between>
    <h2>{title}</h2>
    <span mono>{formattedDate}</span>
  </div>
  <hr />
  <p line-clamp-3>{tldr}</p>
  <div flex justify-between>
    <TagList tags={tags} />
    <ReadCTA readTime={readTime} />
  </div>
</a>
```

**Hover behaviour (React):** use Tailwind `group` + `group-hover:` utilities.
Do NOT use `onMouseOver` attribute handlers. The box-shadow on hover requires
a custom Tailwind class since it uses rgba values not in the default palette —
add to `tailwind.config.js`:
```js
boxShadow: {
  'card-hover': '0 0 0 1px rgba(59,130,246,0.15), 0 8px 32px rgba(0,0,0,0.4)'
}
```

---

### 3.4 `TagChip` — NEW

```jsx
// Props
{ label: string }

// Output
<span className="
  text-[0.68rem] font-medium font-mono tracking-[0.02em]
  text-[#8b949e] bg-white/5 border border-white/10
  rounded px-[10px] py-[3px]
">
  {label}
</span>
```

No hover state. No interactivity.

---

### 3.5 `PostRow` — NEW

**HTML source:** lines 291–369 of the reference HTML (4 repeated `<a>` blocks).

```jsx
// Props
{
  blog: {
    slug: string,
    title: string,
    date: Date
  },
  index: number   // for Framer Motion stagger, capped at 8
}
```

**Hover behaviour:** Tailwind `group` pattern:
- `border-b border-white/5 group-hover:border-blue-500/40`
- title span: `text-[#c9d1d9] group-hover:text-blue-500`

**Date format:** `MMM YYYY` (e.g. `Feb 2026`) — NOT `MMM DD, YYYY`.
Use: `new Date(blog.date).toLocaleDateString('en-US', { month:'short', year:'numeric' })`

**Animation:** Framer Motion stagger, `delay: Math.min(index, 7) * 0.05`,
`duration: 0.3`, `initial: {opacity:0}`, `animate: {opacity:1}`.

---

## 4. Global CSS Changes

Add to `apps/web/src/index.css` (or `assets/main.css`):

```css
/* Blinking cursor for terminal header prompt */
.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
    opacity: 1;
  }
}

/* Dot grid page background */
body {
  background-color: #0d1117;
  background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

---

## 5. `blogs.js` Data Contract Changes

The existing loader at `apps/web/src/blogs/blogs.js` must be extended.
`FeaturedCard` requires `tags` and `readTime` — they are not currently exported.

**Add to each blog object:**
```js
tags: data.tags || [],          // from frontmatter array
readTime: readTime(markdown),   // computed
```

**Add utility function:**
```js
function readTime(markdown) {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
```

**Frontmatter that enables tags:**
```yaml
---
title: Portfolio Redesign Plan
date: 2026-03-13
tldr: A complete rethink using React, Vite, and a blog-first approach.
tags: [React, Architecture]
---
```

---

## 6. Tailwind Config Changes

```js
// tailwind.config.js additions
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        // GitHub dark palette — exact values from design
        page:    '#0d1117',
        surface: '#161b22',
      },
      boxShadow: {
        'card-hover': '0 0 0 1px rgba(59,130,246,0.15), 0 8px 32px rgba(0,0,0,0.4)',
      },
      maxWidth: {
        'content': '48rem',
      }
    }
  }
}
```

---

## 7. Migration Sprint Plan

### Ground rules
- **Trunk-based development:** all work on `master`. Feature flags are not
  needed — the `/archived` route is untouched, so the only live-changing route
  is `/` (BlogList). The old BlogList can be commented-and-kept until Sprint 3
  verifies the new one.
- **TDD where specified:** write the test first, see it fail, then implement.
  Tests use Vitest + React Testing Library (already in the project).
- **One PR per sprint task.** Each task is independently shippable to
  `master` without breaking the existing site.
- **Do not modify:** `BlogPost.jsx`, `Archived.jsx`, `Footer.jsx`, `App.jsx`,
  `blogs/PORTFOLIO_REDESIGN_PLAN.md`.

---

### Sprint 1 — Foundation (no visible UI change)
**Goal:** establish tokens, fonts, global CSS. Existing UI looks identical.

| Task | File | TDD? | Done signal |
|------|------|------|-------------|
| S1-1 | Add `Inter` + `Space Mono` to Google Fonts `<link>` in `index.html` | No | Fonts load in network tab |
| S1-2 | Update `tailwind.config.js` — fontFamily, colors, boxShadow, maxWidth | No | `npx tailwindcss --content ... --dry-run` passes |
| S1-3 | Add `.cursor`, `@keyframes blink`, `prefers-reduced-motion` override to `index.css` | No | Class exists in stylesheet |
| S1-4 | Add dot-grid to `body` in `index.css` | No | Background pattern visible on any page |
| S1-5 | Extend `blogs.js` — add `tags` and `readTime` to each blog object | **Yes** | Test: `blogs[0]` has `tags` array and `readTime >= 1` |

**S1-5 test (write first):**
```js
// blogs.test.js
import blogs from './blogs';
test('each blog has tags array', () => {
  blogs.forEach(b => expect(Array.isArray(b.tags)).toBe(true));
});
test('each blog has readTime >= 1', () => {
  blogs.forEach(b => expect(b.readTime).toBeGreaterThanOrEqual(1));
});
```

---

### Sprint 2 — New Leaf Components
**Goal:** build `TagChip`, `PostRow`, `FeaturedCard` in isolation with tests.
The live route `/` still shows the old `BlogList`.

| Task | File | TDD? | Done signal |
|------|------|------|-------------|
| S2-1 | Create `TagChip.jsx` | **Yes** | Renders label, has correct font classes |
| S2-2 | Create `PostRow.jsx` | **Yes** | Renders title + date, correct href, hover classes present |
| S2-3 | Create `FeaturedCard.jsx` | **Yes** | Renders badge, title, date, excerpt, tags, read CTA |

**S2-1 test:**
```js
// TagChip.test.jsx
import { render, screen } from '@testing-library/react';
import TagChip from './TagChip';

test('renders label text', () => {
  render(<TagChip label="React" />);
  expect(screen.getByText('React')).toBeInTheDocument();
});
test('uses Space Mono font class', () => {
  const { container } = render(<TagChip label="React" />);
  expect(container.firstChild.className).toMatch(/font-mono/);
});
```

**S2-2 test:**
```js
// PostRow.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostRow from './PostRow';

const blog = { slug: 'test', title: 'Test Post', date: new Date('2026-02-01') };

test('renders title', () => {
  render(<MemoryRouter><PostRow blog={blog} index={0} /></MemoryRouter>);
  expect(screen.getByText('Test Post')).toBeInTheDocument();
});
test('renders date as Mon YYYY', () => {
  render(<MemoryRouter><PostRow blog={blog} index={0} /></MemoryRouter>);
  expect(screen.getByText(/Feb 2026/)).toBeInTheDocument();
});
test('href points to /blog/slug', () => {
  render(<MemoryRouter><PostRow blog={blog} index={0} /></MemoryRouter>);
  expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/test');
});
```

**S2-3 test:**
```js
// FeaturedCard.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeaturedCard from './FeaturedCard';

const blog = {
  slug: 'plan', title: 'Portfolio Redesign', date: new Date('2026-03-13'),
  tldr: 'A rethink.', tags: ['React', 'Architecture'], readTime: 5
};

test('renders LATEST badge', () => {
  render(<MemoryRouter><FeaturedCard blog={blog} /></MemoryRouter>);
  expect(screen.getByText(/LATEST/i)).toBeInTheDocument();
});
test('renders all tags as chips', () => {
  render(<MemoryRouter><FeaturedCard blog={blog} /></MemoryRouter>);
  expect(screen.getByText('React')).toBeInTheDocument();
  expect(screen.getByText('Architecture')).toBeInTheDocument();
});
test('renders read time', () => {
  render(<MemoryRouter><FeaturedCard blog={blog} /></MemoryRouter>);
  expect(screen.getByText(/5 min/)).toBeInTheDocument();
});
test('card link points to /blog/slug', () => {
  render(<MemoryRouter><FeaturedCard blog={blog} /></MemoryRouter>);
  expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/plan');
});
```

---

### Sprint 3 — Wire BlogList + Switch Live
**Goal:** replace `BlogList.jsx` content. This is the first sprint where `/`
visually changes in production.

| Task | File | TDD? | Done signal |
|------|------|------|-------------|
| S3-1 | Rewrite `BlogList.jsx` body — featured + section header + rows | **Yes** | Integration test passes |
| S3-2 | Smoke test on `master` — open `/`, `/blog/:slug`, `/archived`, confirm no regressions | No | All 3 routes render without console errors |

**S3-1 test:**
```js
// BlogList.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogList from './BlogList';

// Mock blogs module
vi.mock('../blogs/blogs', () => ({
  default: [
    { slug: 'a', title: 'Post A', date: new Date('2026-03-01'), tldr: 'tldr a', tags: [], readTime: 3 },
    { slug: 'b', title: 'Post B', date: new Date('2026-02-01'), tldr: 'tldr b', tags: [], readTime: 2 },
  ]
}));

test('first post renders as featured card with LATEST badge', () => {
  render(<MemoryRouter><BlogList /></MemoryRouter>);
  expect(screen.getByText(/LATEST/i)).toBeInTheDocument();
  expect(screen.getByText('Post A')).toBeInTheDocument();
});
test('remaining posts render as list rows without badge', () => {
  render(<MemoryRouter><BlogList /></MemoryRouter>);
  expect(screen.getByText('Post B')).toBeInTheDocument();
  expect(screen.getAllByText(/LATEST/i)).toHaveLength(1);
});
test('shows ALL POSTS section header', () => {
  render(<MemoryRouter><BlogList /></MemoryRouter>);
  expect(screen.getByText(/ALL POSTS/i)).toBeInTheDocument();
});
test('empty state renders when no blogs', async () => {
  vi.doMock('../blogs/blogs', () => ({ default: [] }));
  const { default: BlogListFresh } = await import('./BlogList');
  render(<MemoryRouter><BlogListFresh /></MemoryRouter>);
  expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
});
```

---

### Sprint 4 — Header Redesign
**Goal:** update `Header` to dark-always + terminal prompt.
Deliberately last — the header is sitewide and touches all routes.

| Task | File | TDD? | Done signal |
|------|------|------|-------------|
| S4-1 | Remove scroll-triggered white bg swap from `header.jsx` | No | Header stays dark at all scroll positions |
| S4-2 | Add terminal prompt markup (`>`, name, `_` cursor) | **Yes** | Test: cursor span has `aria-hidden` + `cursor` class |
| S4-3 | Update Resume button to outline style | No | Visual check |
| S4-4 | Update Archive link colour to `#8b949e` | No | Visual check |
| S4-5 | Confirm mobile menu still works on `/archived` route | No | Manual tap test |

**S4-2 test:**
```js
// header.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './header';

test('prompt character is aria-hidden', () => {
  render(<MemoryRouter><Header /></MemoryRouter>);
  const prompt = document.querySelector('[aria-hidden="true"]');
  expect(prompt).toBeInTheDocument();
});
test('cursor span has cursor class for blink animation', () => {
  render(<MemoryRouter><Header /></MemoryRouter>);
  const cursor = document.querySelector('.cursor');
  expect(cursor).toBeInTheDocument();
  expect(cursor).toHaveAttribute('aria-hidden', 'true');
});
test('Resume link points to external resume URL', () => {
  render(<MemoryRouter><Header /></MemoryRouter>);
  const resume = screen.getByText(/Resume/i).closest('a');
  expect(resume).toHaveAttribute('href', expect.stringContaining('resume'));
  expect(resume).toHaveAttribute('target', '_blank');
});
```

---

## 8. Files Changed Per Sprint — Summary

| Sprint | Files modified | Files created |
|--------|---------------|---------------|
| S1 | `index.html`, `tailwind.config.js`, `index.css`, `blogs/blogs.js` | `blogs/blogs.test.js` |
| S2 | — | `TagChip.jsx`, `TagChip.test.jsx`, `PostRow.jsx`, `PostRow.test.jsx`, `FeaturedCard.jsx`, `FeaturedCard.test.jsx` |
| S3 | `components/BlogList.jsx` | `BlogList.test.jsx` |
| S4 | `header/header.jsx` | `header/header.test.jsx` |

**Never modified:** `BlogPost.jsx`, `Archived.jsx`, `Footer.jsx`, `App.jsx`,
`redux/*`, `projects/*`, `about/About.jsx`, `hero/HeaderRight.jsx`,
`contact/*`, `blogs/PORTFOLIO_REDESIGN_PLAN.md`

---

## 9. Definition of Done (Per Sprint)

A sprint task is complete when:

- [ ] `pnpm test` passes with no failures
- [ ] `pnpm build` completes with no errors
- [ ] The changed route renders correctly at `http://localhost:5173`
- [ ] No regressions on `/archived` and `/blog/:slug` routes
- [ ] No `console.error` output in browser devtools
- [ ] `aria-hidden` is present on all decorative characters (`>`, `◈`, `_`)
