import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/header';

// Header will be replaced by DarkHeader in the next commit.
// BlogLayout owns the dark scope — the `dark` class here is the
// toggle anchor for Tailwind's darkMode: 'class' strategy.
const BlogLayout = () => (
  <div className="dark min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow w-full">
      <Outlet />
    </main>
  </div>
);

export default BlogLayout;
