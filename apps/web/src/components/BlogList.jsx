import React from 'react';
import { motion } from 'framer-motion';
import blogs from '../blogs/blogs';

const BlogList = () => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (blogs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blogs</h1>
        <p className="text-gray-500 text-lg">No blogs yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-gray-900 mb-12"
      >
        Blogs
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <motion.a
            key={blog.slug}
            href={blog.url || '#'}
            target={blog.url ? '_blank' : '_self'}
            rel={blog.url ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
              {blog.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {blog.tldr}
            </p>
            <div className="text-sm text-gray-400">
              {formatDate(blog.date)}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
