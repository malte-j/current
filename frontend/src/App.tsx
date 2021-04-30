import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import './App.css'
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Protected from './pages/Protected';
import Public from './pages/Public';
import { ProvideAuth } from './services/Auth';
import PrivateRoute from './services/PrivateRoute';
import RedirectOnAuth from './services/RedirectOnAuth';

function App() {

  return (
    <ProvideAuth>
      <Router>
        <div className="app">
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>

            <RedirectOnAuth to="/">
              <Login/>
            </RedirectOnAuth>
            
            <Route path='/login'>
            </Route>
            <Route path='/public'>
              <Public/>
            </Route>
            <PrivateRoute path='/protected'>
              <Protected/>
            </PrivateRoute>
          </Switch>
        </div>

      </Router>
    </ProvideAuth>
  )
}

export default App
