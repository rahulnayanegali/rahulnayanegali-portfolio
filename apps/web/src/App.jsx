import React from 'react'
import './App.css';
import Header from './header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme/theme';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Archived from './archived/Archived';
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
                        <Switch>
                            <Route exact path="/">
                                <BlogList />
                            </Route>
                            <Route path="/blog/:slug">
                                <BlogPost />
                            </Route>
                            <Route path="/archived">
                                <Archived />
                            </Route>
                        </Switch>
                    </main>

                    <Footer />
                </div>
            </Router>
        </ThemeProvider>
    )
}
