import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import blogs from '../blogs/blogs';

const BlogPost = () => {
  const { slug } = useParams();
  const blog = blogs.find(b => b.slug === slug);

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to blogs
        </Link>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          to="/" 
          className="text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Back to blogs
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>

        <div className="text-gray-500 mb-8">
          {formatDate(blog.date)}
        </div>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogPost;
