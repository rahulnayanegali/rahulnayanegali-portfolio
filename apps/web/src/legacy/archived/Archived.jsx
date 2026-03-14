import React from 'react';
import About from '../about/About';
import SocialFeed from '../components/SocialFeed';
import Projects from '../projects/projects';

const Archived = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 md:h-20" />

      <section className="w-full py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <About />
        </div>
      </section>

      <section className="w-full py-20 bg-white relative ">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SocialFeed />
        </div>
      </section>

      <section className="w-full py-16 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Projects />
        </div>
      </section>
    </div>
  );
};

export default Archived;
