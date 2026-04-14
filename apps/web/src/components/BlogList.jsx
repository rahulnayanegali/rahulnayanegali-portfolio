import React from 'react';
import blogs from '../blogs/blogs';
import FeaturedCard from './FeaturedCard';
import PostRow from './PostRow';

const AllPostsHeader = () => (
  <div className="flex items-center gap-4 mt-[44px]">
    <span className="text-[0.62rem] font-bold font-mono tracking-[0.14em] uppercase text-[#8b949e] whitespace-nowrap">
      All Posts
    </span>
    <div className="flex-1 h-px bg-white/[0.07]" />
  </div>
);

const Manifesto = () => (
  <>
    <p className="leading-[1.65]">
      <span className="text-[22px] text-[#e6edf3]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 900 }}>Breathe. Acclimatize.</span><br />
      <span className="text-[17px] text-[#6e7681]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 900 }}>A boundary to acclimatize from.</span><br />
      <span className="text-[12px] text-[#6e7681] font-mono font-black">Dive. Understand. Redraw. Repeat.</span>
    </p>
    <div className="mt-[32px] h-px bg-white/[0.07]" />
  </>
);

const BlogList = () => {
  if (blogs.length === 0) {
    return (
      <div className="max-w-content mx-auto px-6 py-[52px]">
        <p className="text-[#8b949e]">No posts yet. Check back soon.</p>
      </div>
    );
  }

  const [featured, ...rest] = blogs;

  return (
    <div className="max-w-content mx-auto px-6 py-[52px] pb-[100px]">
      <Manifesto />
      <FeaturedCard blog={featured} />
      {rest.length > 0 && (
        <>
          <AllPostsHeader />
          {rest.map((blog, i) => (
            <PostRow key={blog.slug} blog={blog} index={i} />
          ))}
        </>
      )}
    </div>
  );
};

export default BlogList;
