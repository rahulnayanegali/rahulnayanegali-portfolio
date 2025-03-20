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
                <div className="bg-gray-100">
                    <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 gap-8">
                        <Header />
                        <HeaderSpacer />
                        <About />
                        <div className="w-full block h-screen relative">
                            <SocialFeed />
                        </div>
                        <Projects />
                        {/* <ContactUs /> */}
                        <Footer />
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    )
}


const HeaderSpacer = () => {
    return <div className="h-16 md:h-20" />;
  };

