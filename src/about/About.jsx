import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import HeaderRight from '../hero/HeaderRight';

const Hero = () => {
  const controls = useAnimation();
  const [ref, isInView] = useInView({ threshold: 0.25, triggerOnce: true });
  const [isLoaded, setIsLoaded] = useState(false);

  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    const section = document.querySelector(sectionId);

    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Offset for header height
        behavior: 'smooth'
      });
    }
  };

  // Track button clicks for analytics
  const trackButtonClick = (buttonName) => {
    console.log(`Button clicked: ${buttonName}`);

  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      setIsLoaded(true);
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-16 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-blue-50/30 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-gray-50/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent transform -rotate-12"></div>
      </div>

      <motion.div
        className="w-full lg:w-3/5 pt-12 lg:pt-0"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div
          className="space-y-2"
          variants={itemVariants}
        >
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
            Senior React Developer
          </span>
        </motion.div>

        <motion.h1
          className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-gray-900"
          variants={itemVariants}
        >
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Rahul</span>
        </motion.h1>

        <motion.h2
          className="mt-3 text-3xl md:text-4xl font-semibold text-gray-700"
          variants={itemVariants}
        >
          I architect exceptional <span className="relative inline-block">
            React applications
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-400 rounded-full"></span>
          </span>
        </motion.h2>

        <motion.p
          className="mt-6 text-lg text-gray-600 max-w-xl"
          variants={itemVariants}
        >
          Specializing in high-performance React ecosystems with TypeScript,
          Next.js, and advanced state management patterns.
          Delivering scalable frontend architectures that drive business outcomes.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap gap-4"
          variants={itemVariants}
        >
          <motion.a
            href="#footer"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              const footerElement = document.querySelector('#footer');
              if (footerElement) {
                window.scrollTo({
                  top: footerElement.offsetTop - 80, 
                  behavior: 'smooth'
                });
              }

            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            role="button"
            aria-label="Contact me to discuss your project"
          >
            <span>Discuss Your Project</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.a>

          <motion.a
            href="https://linkedin.com/in/rahulnayanegali"
            onClick={(e) => {
              // For external links, we should NOT prevent default
              // But we should still track the click
              try {
                if (typeof window.gtag === 'function') {
                  window.gtag('event', 'click', {
                    'event_category': 'external_link',
                    'event_label': 'LinkedIn Profile',
                    'transport_type': 'beacon' // Ensures the event is sent even if page unloads
                  });
                }
                console.log('LinkedIn button clicked');
              } catch (err) {
                console.error('Analytics error:', err);
              }
            }}
            target="_blank"
            rel="noopener noreferrer" // Security best practice for target="_blank"
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-600 bg-white border border-blue-100 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 group"
            role="button"
            aria-label="View my LinkedIn profile"
          >
            <span>View LinkedIn</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.a>
        </motion.div>


        <motion.div
          className="mt-10 grid grid-cols-3 gap-6 max-w-md"
          variants={itemVariants}
        >
          {['React', 'TypeScript', 'Next.js'].map((tech, index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600">{tech}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full lg:w-2/5 mt-12 lg:mt-0 relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-purple-50/30 rounded-3xl transform rotate-3 scale-105 blur-xl"></div>
        </div>

        <div className="relative z-10 p-1 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 animate-gradient-x"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-xl p-1">
            <HeaderRight />
          </div>
        </div>

        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-100 rounded-full blur-2xl opacity-60"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
