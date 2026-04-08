/**
 * prerender.mjs
 *
 * Postbuild script for static HTML generation.
 *
 * For every blog post, it copies dist/index.html and injects the post's
 * <title>, description <meta>, and og: tags into the <head>.  The result
 * is written to dist/blog/<slug>/index.html so Netlify (and crawlers) see
 * the real title without needing client-side JavaScript.
 *
 * Run after `vite build`:
 *   node prerender.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOGS_DIR = join(__dirname, 'src/blogs');
const DIST_DIR  = join(__dirname, 'dist');

// ---------------------------------------------------------------------------
// Frontmatter parser (matches the one in blogs.js)
// ---------------------------------------------------------------------------
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  // Minimal YAML key: value extraction (no js-yaml dep at build time)
  const data = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (m) data[m[1]] = m[2].trim();
  }
  return { data, content: match[2] };
}

// ---------------------------------------------------------------------------
// Inject <title> and <meta> into the HTML template
// ---------------------------------------------------------------------------
function injectMeta(template, { title, description }) {
  const escapedTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedDesc  = description.replace(/"/g, '&quot;').replace(/</g, '&lt;');

  const metaTags = [
    `<title>${escapedTitle}</title>`,
    `<meta name="description" content="${escapedDesc}" />`,
    `<meta property="og:title" content="${escapedTitle}" />`,
    `<meta property="og:description" content="${escapedDesc}" />`,
  ].join('\n    ');

  // Remove any existing <title> the template has, then prepend ours
  return template
    .replace(/<title>[^<]*<\/title>/, '')
    .replace('</head>', `    ${metaTags}\n  </head>`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8');

const mdFiles = readdirSync(BLOGS_DIR).filter(
  (f) => f.endsWith('.md') && f !== 'PORTFOLIO_REDESIGN_PLAN.md'
);

let count = 0;

for (const file of mdFiles) {
  const raw  = readFileSync(join(BLOGS_DIR, file), 'utf-8');
  const slug = file.replace('.md', '');
  const { data, content } = parseFrontmatter(raw);

  let title = data.title || '';
  let tldr  = data.tldr  || '';

  if (!title) {
    const h1 = content.split('\n').find((l) => l.startsWith('# '));
    if (h1) title = h1.replace(/^# /, '').trim();
  }
  if (!title) title = slug;

  if (!tldr) {
    const lines   = content.split('\n');
    const tldrIdx = lines.findIndex((l) => l.startsWith('## TLDR'));
    if (tldrIdx !== -1 && lines[tldrIdx + 1]) {
      tldr = lines[tldrIdx + 1].replace(/^[-*\s]*/, '').trim();
    }
  }

  const outDir  = join(DIST_DIR, 'blog', slug);
  const outFile = join(outDir, 'index.html');

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, injectMeta(template, { title, description: tldr }), 'utf-8');

  console.log(`  ✓ /blog/${slug}  →  "${title}"`);
  count++;
}

console.log(`\nPrerendered ${count} blog post${count !== 1 ? 's' : ''}.`);
