import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/Footer';

const ArchivedLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col bg-gray-100">
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header />
    </div>
    <main className="flex-grow w-full">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default ArchivedLayout;
