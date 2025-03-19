import React from 'react';
import * as FaIcons from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-semibold text-white mb-4">About This Site</h3>
                        <p className="text-sm leading-relaxed">
                            Built with React, Vite, and TailwindCSS. 
                            Hosted with love and continuous deployment.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-white mb-4">Connect</h3>
                        <div className="flex justify-center space-x-6">
                            <a href="https://github.com/rahulnayanegali" 
                               className="hover:text-white transition-colors duration-300"
                               target="_blank" 
                               rel="noopener noreferrer"
                               aria-label="GitHub">
                                <FaIcons.FaGithub size={24} />
                            </a>
                            <a href="https://linkedin.com/in/rahulnayanegali" 
                               className="hover:text-white transition-colors duration-300"
                               target="_blank" 
                               rel="noopener noreferrer"
                               aria-label="LinkedIn">
                                <FaIcons.FaLinkedin size={24} />
                            </a>
                            <a href="https://twitter.com/rahulnayanegali" 
                               className="hover:text-white transition-colors duration-300"
                               target="_blank" 
                               rel="noopener noreferrer"
                               aria-label="Twitter">
                                <FaIcons.FaTwitter size={24} />
                            </a>
                            <a href="mailto:contact@rahulnayanegali.com" 
                               className="hover:text-white transition-colors duration-300"
                               aria-label="Email">
                                <FaIcons.FaEnvelope size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Credits Section */}
                    <div className="text-center md:text-right">
                        <h3 className="text-xl font-semibold text-white mb-4">Technologies</h3>
                        <div className="text-sm space-y-2">
                            <p>React {React.version}</p>
                            <p>Vite 5.0</p>
                            <p>TailwindCSS 3.3</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-700 text-center">
                    <p className="text-sm">
                        © {currentYear} Rahul Nayanegali. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Made with ❤️ in India & USA
                    </p>
                </div>
            </div>
        </footer>
    );
};