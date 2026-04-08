#!/usr/bin/env node
/**
 * Post-build script: generates dist/blog/[slug]/index.html for each blog post
 * with correct OG/Twitter meta tags injected, so social crawlers see the right preview.
 *
 * Netlify serves real files before applying the /* catch-all redirect,
 * so crawlers get per-post HTML while the SPA still works normally for users.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WEB_DIR = path.join(__dirname, '..');
const BLOGS_DIR = path.join(WEB_DIR, 'src', 'blogs');
const DIST_DIR = path.join(WEB_DIR, 'dist');
const BASE_URL = 'https://rahulnayanegali.dev';

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) fm[key] = val;
  }
  return fm;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectMeta(html, { title, description, url }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(url);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="title" content=")[^"]*(")/,         `$1${t}$2`)
    .replace(/(<meta name="description" content=")[^"]*(")/,   `$1${d}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/,   `$1article$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/,    `$1${u}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/,  `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/,    `$1${d}$2`)
    .replace(/(<meta property="twitter:url" content=")[^"]*(")/,       `$1${u}$2`)
    .replace(/(<meta property="twitter:title" content=")[^"]*(")/,     `$1${t}$2`)
    .replace(/(<meta property="twitter:description" content=")[^"]*(")/,`$1${d}$2`);
}

const baseHtmlPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(baseHtmlPath)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');
const mdFiles = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'));

let count = 0;
for (const file of mdFiles) {
  const content = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf-8');
  const fm = parseFrontmatter(content);

  // Only process real blog posts (must have both title and tldr)
  if (!fm.title || !fm.tldr) continue;

  const slug = path.basename(file, '.md');
  const url = `${BASE_URL}/blog/${slug}`;
  const title = `${fm.title} | Rahul Nayanegali`;
  const description = fm.tldr;

  const injected = injectMeta(baseHtml, { title, description, url });

  const outDir = path.join(DIST_DIR, 'blog', slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), injected);
  console.log(`  /blog/${slug}`);
  count++;
}

console.log(`\nInjected OG meta tags for ${count} blog posts.`);
