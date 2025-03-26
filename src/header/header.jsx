import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Track scroll position for dynamic header styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when changing routes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Determine if a nav item is active based on hash or path
    const isActive = (href) => {
        if (href.startsWith('#')) {
            return location.hash === href;
        }
        return location.pathname === href;
    };

    const navLinks = [
        { name: 'Tweets', href: '#tweets' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#footer' }
    ];

    return (
        <header
            className={`transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-sm shadow-lg py-3 text-gray-900'
                : 'bg-transparent py-6 text-white'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="group relative">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center"
                    >
                        <span className={`font-bold text-2xl md:text-3xl tracking-tight ${
                            isScrolled ? 'text-gray-900 group-hover:text-blue-600' : 'text-white group-hover:text-blue-300'
                        } transition-colors duration-300`}>
                            Rahul Nayanegali
                        </span>
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="hidden md:flex items-center space-x-8"
                >
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className={`relative text-lg font-medium transition-colors duration-300 ${
                                isScrolled
                                    ? isActive(link.href)
                                        ? 'text-blue-600'
                                        : 'text-gray-700 hover:text-blue-600'
                                    : isActive(link.href)
                                        ? 'text-blue-300'
                                        : 'text-gray-100 hover:text-blue-300'
                            }`}
                        >
                            {link.name}
                            {isActive(link.href) && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className={`absolute -bottom-1 left-0 w-full h-0.5 ${
                                        isScrolled ? 'bg-blue-600' : 'bg-blue-300'
                                    }`}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </a>
                    ))}

                    <motion.a
                        href="https://rahulnayanegali.github.io/resume/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2 rounded-md ${
                            isScrolled
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-white text-gray-900 hover:bg-gray-100'
                        } font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                        Resume
                    </motion.a>

                </motion.div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className={`block py-3 text-center text-xl font-medium ${isActive(link.href)
                                        ? 'text-blue-600'
                                        : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-2">
                                <a
                                    href="https://rahulnayanegali.github.io/resume/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Resume
                                </a>


                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
