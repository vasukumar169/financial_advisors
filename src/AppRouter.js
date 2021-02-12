import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar'
import Home from './pages/home'
import Calculator from './pages/calculator'

export default function AppRouter() {
  return (
    <Router>
      <div>
        <Navbar/>
        <Switch>
          <Route path='/home'>
            <Home />
          </Route>
          <Route path='/calculator'>
            <Calculator />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}