import React from 'react';
import './App.css';
import Header from './header/header';
import About from './about/about';
import Projects from './projects/projects';
import Contact from './contact/contact';
import { BrowserRouter as Router,  Route, Switch} from 'react-router-dom'

function App() {
  return (
    <div className=" mx-auto bg-gray-100">

      {/* <Router>
      <Header />
      <Switch>
        <Route exact path="/about" component={About}>
        </Route>
        <Route path="/projects" component={Projects}>
        </Route>
        <Route path="/contact" component={Contact}>
          <Contact />
        </Route>
    </Switch>
    </Router> */}
    <Router>
    <Header />
    <About/>
    <Projects/>
    <Contact/>
    </Router>
    
    </div>
  );
}

export default App;
