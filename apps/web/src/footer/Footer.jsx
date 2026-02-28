import React, { useState, useEffect, useRef } from 'react';
import * as FaIcons from 'react-icons/fa';
import { IoRocketOutline } from 'react-icons/io5';
import { SiReact, SiVite, SiTailwindcss } from 'react-icons/si';
import { FaMedium } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);
    
    // Intersection Observer for scroll-based animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        
        if (footerRef.current) {
            observer.observe(footerRef.current);
        }
        
        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);
    
    // Smooth scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    
    return (
        <footer 
            id='footer'
            ref={footerRef}
            className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            {/* Subtle background pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ 
                    backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.15) 2px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* About Section with staggered animation */}
                    <div className={`text-center md:text-left transition-all duration-700 delay-100 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                        <h3 className="text-xl font-semibold text-white mb-4 inline-block relative group">
                            About This Site
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Engineered with React, Vite, and TailwindCSS. Crafted with modern architecture principles and performance optimization techniques.
                        </p>
                        <p className="text-sm mt-3 leading-relaxed">
                            Implemented with component-based design, lazy loading, and a focus on Core Web Vitals metrics.
                        </p>
                    </div>

                    {/* Connect Section with interactive elements */}
                    <div className={`text-center transition-all duration-700 delay-200 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                        <h3 className="text-xl font-semibold text-white mb-4 inline-block relative group">
                            Connect
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                        </h3>
                        <div className="flex justify-center space-x-6">
                            <a 
                                href="https://github.com/rahulnayanegali" 
                                className="group relative hover:text-white transition-all duration-300"
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                            >
                                <span className="absolute -inset-2 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></span>
                                <FaIcons.FaGithub size={24} className="relative transform group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            <a 
                                href="https://linkedin.com/in/rahulnayanegali" 
                                className="group relative hover:text-white transition-all duration-300"
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <span className="absolute -inset-2 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></span>
                                <FaIcons.FaLinkedin size={24} className="relative transform group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            <a 
                                href="https://twitter.com/rahulnayanegali" 
                                className="group relative hover:text-white transition-all duration-300"
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                            >
                                <span className="absolute -inset-2 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></span>
                                <FaIcons.FaTwitter size={24} className="relative transform group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            <a 
                                href="https://medium.com/@rahulnayanegali" 
                                className="group relative hover:text-white transition-all duration-300"
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Medium"
                            >
                                <span className="absolute -inset-2 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></span>
                                <FaMedium size={24} className="relative transform group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            <a 
                                href="mailto:contact@rahulnayanegali.com" 
                                className="group relative hover:text-white transition-all duration-300"
                                aria-label="Email"
                            >
                                <span className="absolute -inset-2 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></span>
                                <FaIcons.FaEnvelope size={24} className="relative transform group-hover:scale-110 transition-transform duration-300" />
                            </a>
                        </div>
                        
                        {/* Newsletter Signup with gradient button */}
                        <div className="mt-8">
                            <form className="flex flex-col sm:flex-row gap-2 justify-center">
                                <input 
                                    type="email" 
                                    placeholder="Subscribe to updates" 
                                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    aria-label="Email for newsletter"
                                />
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-white text-sm flex items-center justify-center"
                                >
                                    <span>Subscribe</span>
                                    <IoRocketOutline className="ml-2" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Tech Stack Section with pill components */}
                    <div className={`text-center md:text-right transition-all duration-700 delay-300 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                        <h3 className="text-xl font-semibold text-white mb-4 inline-block relative group">
                            Tech Stack
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                        </h3>
                        <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-4">
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium hover:bg-gray-700 transition-colors duration-300 flex items-center">
                                <SiReact className="mr-1 text-blue-400" /> React {React.version}
                            </span>
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium hover:bg-gray-700 transition-colors duration-300 flex items-center">
                                <SiVite className="mr-1 text-purple-400" /> Vite 5.0
                            </span>
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium hover:bg-gray-700 transition-colors duration-300 flex items-center">
                                <SiTailwindcss className="mr-1 text-cyan-400" /> TailwindCSS 3.3
                            </span>
                        </div>
                        
                        {/* Performance stats */}
                        <div className="mt-6 text-sm text-gray-400">
                            <p className="flex items-center justify-end"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> 100% Test Coverage</p>
                            <p className="flex items-center justify-end"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> A11y Compliant</p>
                            <p className="flex items-center justify-end"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Mobile Optimized</p>
                        </div>
                    </div>
                </div>

                {/* Custom divider with gradient design */}
                <div className={`my-8 flex items-center transition-all duration-700 delay-400 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                    <div className="px-4">
                        <div className="w-4 h-4 rotate-45 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                    </div>
                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                </div>

                {/* Copyright with interactive elements */}
                <div className={`text-center relative transition-all duration-700 delay-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <p className="text-sm">
                        © 2020 - {currentYear} Rahul Nayanegali. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500 mt-2 inline-flex items-center justify-center">
                        <span>Made with </span>
                        <span className="mx-1 relative group">
                            <span className="absolute opacity-0 group-hover:opacity-100 -translate-y-1 transition-all duration-700 ease-out text-pink-500">
                                ❤️
                            </span>
                            <span className="inline-block group-hover:translate-y-1 group-hover:opacity-0 transition-all duration-300 ease-out">
                                ❤️
                            </span>
                        </span>
                        <span> in India & USA</span>
                    </p>
                    
                    {/* Back to top button */}
                    <button 
                        onClick={scrollToTop}
                        className="absolute right-0 bottom-0 md:right-4 md:bottom-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-300 group"
                        aria-label="Back to top"
                    >
                        <FaIcons.FaArrowUp size={16} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
