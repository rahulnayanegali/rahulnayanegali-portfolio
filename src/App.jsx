import React from 'react'
import './App.css';
import Header from './header/header';
import About from './about/About';
import Projects from './projects/projects';
import {
    BrowserRouter as Router,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme/theme';
import SocialFeed from './components/SocialFeed';
import Footer from './footer/Footer';

export default function App() {
    const theme = lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col bg-gray-100">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                        <Header />
                    </div>
                    
                    <main className="flex-grow w-full">
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

                        <div className="w-full h-16 bg-gradient-to-b from-gray-50 to-gray-100"></div>
                    </main>
                    
                    <Footer />
                </div>
            </Router>
        </ThemeProvider>
    )
}

const HeaderSpacer = () => {
    return <div className="h-16 md:h-20" />;
};

