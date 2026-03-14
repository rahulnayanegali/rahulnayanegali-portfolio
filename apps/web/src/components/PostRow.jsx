import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/** @param {{ blog: import('../blogs/blogs').BlogPost, index: number }} props */
const PostRow = ({ blog, index }) => {
  const d = new Date(blog.date);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const date = `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index, 7) * 0.05 }}
    >
      <Link
        to={`/blog/${blog.slug}`}
        className="group flex items-baseline justify-between gap-4 py-[18px] border-b border-white/5 hover:border-blue-500/40 no-underline transition-colors"
      >
        <div className="flex items-baseline gap-3">
          <span aria-hidden="true" className="text-blue-500 text-[0.75rem] flex-shrink-0 font-mono">◈</span>
          <span className="text-[0.92rem] font-medium text-[#c9d1d9] group-hover:text-blue-500 transition-colors">
            {blog.title}
          </span>
        </div>
        <span className="text-[0.75rem] text-[#8b949e] whitespace-nowrap flex-shrink-0 font-mono">
          {date}
        </span>
      </Link>
    </motion.div>
  );
};

export default PostRow;
