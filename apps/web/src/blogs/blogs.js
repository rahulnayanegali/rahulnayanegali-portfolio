import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

import matter from 'gray-matter';
import portfolioRedesign from './PORTFOLIO_REDESIGN_PLAN.md?raw';

const blogFiles = [
  { filename: 'PORTFOLIO_REDESIGN_PLAN.md', content: portfolioRedesign }
];

const blogs = blogFiles.map(({ filename, content }) => {
  const { data, content: markdown } = matter(content);
  
  const lines = markdown.split('\n');
  let title = data.title || 'Untitled';
  let tldr = data.tldr || '';
  
  if (title === 'Untitled') {
    const h1Match = lines.find(line => line.startsWith('# '));
    if (h1Match) title = h1Match.replace('# ', '').trim();
  }
  
  if (!tldr) {
    const tldrIndex = lines.findIndex(line => line.startsWith('## TLDR'));
    if (tldrIndex !== -1 && lines[tldrIndex + 1]) {
      tldr = lines[tldrIndex + 1].replace(/^[-*\s]*/, '').trim();
    }
  }

  return {
    slug: filename.replace('.md', ''),
    title,
    tldr,
    date: data.date ? new Date(data.date) : new Date(0),
    url: data.url || null
  };
});

blogs.sort((a, b) => b.date - a.date);

export default blogs;
