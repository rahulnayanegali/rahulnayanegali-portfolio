---
title: "Portfolio Redesign: Adding Blog Section & Archiving Current Content"
tldr: "Transform the portfolio main page from static content to a dynamic blog listing, move existing sections (About, Tweets, Projects) to an archived page, and implement a markdown-based blog system."
date: "2024-01-15"
tags: [React, Architecture]
---

# Portfolio Redesign: Adding Blog Section & Archiving Current Content

## TLDR
Transform the portfolio main page from static content to a dynamic blog listing, move existing sections (About, Tweets, Projects) to an archived page, and implement a markdown-based blog system.

---

## 1. Background

The current portfolio main page contains:
- About section
- SocialFeed (Twitter tweets)
- Projects section

This redesign will:
- Replace main page with blog listing
- Move existing content to `/archived` route
- Add "Archive" link in navigation

---

## 2. Technical Approach

### Blog Storage
- **Location**: `/apps/web/src/blogs/`
- **Format**: Markdown files with YAML frontmatter
- **Libraries**: `gray-matter` (frontmatter parsing), `react-markdown` (rendering)

### Blog Frontmatter Format
```yaml
---
title: "Blog Post Title"
tldr: "A brief summary (1-2 sentences)"
date: "2024-01-15"
url: "https://optional-external-link.com"
---
```

### Routing Structure

| Route | Content |
|-------|---------|
| `/` | Blog listing (newest first) |
| `/archived` | About + SocialFeed + Projects |

---

## 3. Implementation Steps

### Step 1: Install Dependencies
```bash
pnpm add gray-matter react-markdown
```

### Step 2: Create Blog Directory & Sample Posts
```
src/blogs/
├── blogs.js          # Import all markdown, export sorted list
└── portfolio-redesign.md  # Sample blog with this plan
```

### Step 3: Create Blog Components
- `src/components/BlogList.jsx` - Grid of blog cards (title + tldr)
- Blog cards link to `url` (external) or open inline

### Step 4: Create Archived Page
- `src/archived/Archived.jsx` - Single page with About, SocialFeed, Projects

### Step 5: Update App Routing
- Modify `src/App.jsx` - Use React Router, render BlogList at `/`
- Modify `src/main.jsx` - Add route for `/archived`

### Step 6: Update Navigation
- Add "Archive" to header navLinks pointing to `/archived`

---

## 4. UI/UX Details

### Blog Card Design
- Title (clickable, opens in new tab)
- TLDR text
- Optional: date display

### Blog List Layout
- Card grid (responsive: 1-3 columns)
- Empty state: "No blogs yet"

### Navigation
- "Archive" link in header (desktop + mobile)

---

## 5. File Changes Summary

| Action | File |
|--------|------|
| Create | `src/blogs/blogs.js` |
| Create | `src/blogs/portfolio-redesign.md` |
| Create | `src/components/BlogList.jsx` |
| Create | `src/archived/Archived.jsx` |
| Modify | `src/App.jsx` |
| Modify | `src/main.jsx` |
| Modify | `src/header/header.jsx` |
| Modify | `package.json` (deps) |

---

## 6. Acceptance Criteria

- [ ] Main page (`/`) shows blog listing
- [ ] Blogs sorted by date (newest first)
- [ ] Blog cards display title + TLDR
- [ ] Clicking blog opens in new tab (if URL provided)
- [ ] `/archived` shows About, SocialFeed, Projects
- [ ] Header has "Archive" navigation link
- [ ] Empty state shown when no blogs exist
- [ ] Sample blog post created with this plan

---

## 7. Credits

| Contributor | Role |
|-------------|------|
| **Rahul Nayanegali** | Project owner, provided requirements and approved the plan |
| **OpenCode (AI Assistant)** | Researched codebase structure, designed technical approach, created implementation plan |
