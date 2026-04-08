import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import blogs from '../blogs/blogs';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const BlogPost = () => {
  const { slug } = useParams();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '52px 24px' }}>
        <h1 style={{ color: '#e6edf3', fontSize: '1.5rem', fontWeight: 700 }}>Post not found</h1>
        <Link
          to="/"
          style={{ color: '#3b82f6', textDecoration: 'none', display: 'inline-block', marginTop: '16px' }}
        >
          ← Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ maxWidth: '48rem', margin: '0 auto', padding: '52px 24px 100px' }}
    >
      {/* Back link */}
      <Link
        to="/"
        style={{
          color: '#3b82f6',
          textDecoration: 'none',
          fontSize: '0.875rem',
          display: 'inline-block',
          marginBottom: '32px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#3b82f6')}
      >
        ← Back to blogs
      </Link>

      {/* Title */}
      <h1
        style={{
          color: '#e6edf3',
          fontSize: '1.9rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          marginBottom: '12px',
        }}
      >
        {blog.title}
      </h1>

      {/* Date */}
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.78rem',
          color: '#8b949e',
          marginBottom: '40px',
        }}
      >
        {formatDate(blog.date)}
      </div>

      {/* Prose */}
      <div className="blog-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {blog.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default BlogPost;
