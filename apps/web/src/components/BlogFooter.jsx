import React from 'react';

const BlogFooter = () => (
  <footer className="border-t border-white/5 py-6 text-center">
    <span className="text-[#8b949e] text-sm font-mono">
      Rahul Nayanegali © 2020–{new Date().getFullYear()}
    </span>
  </footer>
);

export default BlogFooter;
