import React from 'react';
import './App.css';
import Header from './header/header';
import About from './about/about';
import Works from './works/works';
import Contact from './contact/contact';

function App() {
  return (
    <div class="max-w-7xl mx-auto ...">
      <Header />
      <About />
      <Works />
      <Contact />
    </div>
  );
}

export default App;
