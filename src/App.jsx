import React from 'react'
import './App.css';
import Header from './header/header';
import About from './about/About';
import Projects from './projects/projects';
import Contact from './contact/Contact';
import ContactUs from './contact/ContactUs'
import {
    BrowserRouter as Router,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme/theme';
import SocialFeed from './components/SocialFeed';
import Footer from './footer/Footer';

export default function App() {
    // You can implement dark mode logic here if needed
    const theme = lightTheme; // or darkTheme based on user preference

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div className="bg-gray-100">
                    <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 gap-8">
                        <Header />
                        <About />
                        <Projects />
                        {/* <div className="min-h-[600px] w-full block">
                            <SocialFeed />
                        </div> */}
                        <ContactUs />
                        <Footer />
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    )
}
