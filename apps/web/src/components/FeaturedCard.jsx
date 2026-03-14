import React from 'react';
import { Link } from 'react-router-dom';
import TagChip from './TagChip';

/** @param {{ blog: import('../blogs/blogs').BlogPost }} props */
const FeaturedCard = ({ blog }) => {
  const date = new Date(blog.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group block no-underline text-inherit
        bg-[#161b22] rounded-[10px]
        border border-white/[0.07] border-l-[3px] border-l-blue-500
        px-8 py-7
        transition-[border-color,box-shadow] duration-200
        hover:shadow-card-hover hover:border-blue-500/50"
    >
      {/* Badge */}
      <div className="text-[0.62rem] font-bold font-mono tracking-[0.14em] uppercase text-blue-500 mb-[14px]">
        ▓ Latest
      </div>

      {/* Title + Date */}
      <div className="flex justify-between items-baseline gap-4 flex-wrap">
        <h2 className="text-[1.3rem] font-bold text-[#e6edf3] tracking-[-0.02em] leading-[1.3]">
          {blog.title}
        </h2>
        <span className="text-[0.78rem] text-[#8b949e] whitespace-nowrap flex-shrink-0 font-mono">
          {date}
        </span>
      </div>

      {/* Divider */}
      <hr className="border-none border-t border-white/[0.07] my-[14px]" />

      {/* Excerpt */}
      <p className="text-[0.9rem] text-[#8b949e] leading-[1.75] line-clamp-3">
        {blog.tldr}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {blog.tags.map(tag => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>

        {/* Read CTA */}
        <div className="flex items-center gap-[6px] text-[0.82rem] font-semibold text-blue-500">
          <span className="text-[0.75rem] text-[#8b949e] font-normal font-mono">
            {blog.readTime} min
          </span>
          <span className="text-[#30363d]">·</span>
          <span>Read</span>
          <span aria-hidden="true" className="text-[0.8rem]">→</span>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
