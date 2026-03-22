import React from 'react';

const links = [
  { label: 'github', href: 'https://github.com/rahulnayanegali' },
  { label: 'linkedin', href: 'https://linkedin.com/in/rahulnayanegali' },
  { label: '𝕏', href: 'https://x.com/rahulnayanegali' },
];

const BlogFooter = () => (
  <footer className="border-t border-white/5 py-6 text-center">
    <span className="text-[#8b949e] text-sm font-mono">
      Rahul Nayanegali © 2020–{new Date().getFullYear()}
      {links.map(({ label, href }) => (
        <span key={label}>
          <span className="mx-2 opacity-30">·</span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {label}
          </a>
        </span>
      ))}
    </span>
  </footer>
);

export default BlogFooter;
