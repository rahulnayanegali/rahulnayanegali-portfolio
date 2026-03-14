import React from 'react';
import { Outlet } from 'react-router-dom';
import DarkHeader from '../header/DarkHeader';
import BlogFooter from '../components/BlogFooter';

// BlogLayout owns the dark scope — the `dark` class here is the
// toggle anchor for Tailwind's darkMode: 'class' strategy.
const BlogLayout = () => (
  <div className="dark min-h-screen flex flex-col">
    <DarkHeader />
    <main className="flex-grow w-full"><Outlet /></main>
    <BlogFooter />
  </div>
);

export default BlogLayout;
