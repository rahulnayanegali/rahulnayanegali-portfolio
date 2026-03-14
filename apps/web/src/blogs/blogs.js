import yaml from 'js-yaml';

/**
 * @typedef {Object} BlogPost
 * @property {string} slug
 * @property {string} title
 * @property {string} tldr
 * @property {Date} date
 * @property {string[]} tags
 * @property {number} readTime
 * @property {string} content
 */

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  return {
    data: yaml.load(match[1]) || {},
    content: match[2],
  };
}

function readTime(markdown) {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const modules = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true });

/** @type {BlogPost[]} */
const blogs = Object.entries(modules).map(([path, raw]) => {
  const slug = path.replace('./', '').replace('.md', '');
  const { data, content } = parseFrontmatter(raw);

  let title = data.title || '';
  let tldr = data.tldr || '';

  if (!title) {
    const h1 = content.split('\n').find(l => l.startsWith('# '));
    if (h1) title = h1.replace('# ', '').trim();
  }

  if (!tldr) {
    const lines = content.split('\n');
    const tldrIdx = lines.findIndex(l => l.startsWith('## TLDR'));
    if (tldrIdx !== -1 && lines[tldrIdx + 1]) {
      tldr = lines[tldrIdx + 1].replace(/^[-*\s]*/, '').trim();
    }
  }

  return {
    slug,
    title: title || 'Untitled',
    tldr,
    date: data.date ? new Date(data.date) : new Date(0),
    tags: Array.isArray(data.tags) ? data.tags : [],
    readTime: readTime(content),
    content,
  };
});

blogs.sort((a, b) => b.date - a.date);

export default blogs;
