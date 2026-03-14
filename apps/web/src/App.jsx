import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogLayout from './layouts/BlogLayout';
import ArchivedLayout from './layouts/ArchivedLayout';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Archived from './archived/Archived';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BlogLayout />}>
          <Route index element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogPost />} />
        </Route>
        <Route element={<ArchivedLayout />}>
          <Route path="archived" element={<Archived />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
