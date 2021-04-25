import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Nav from './components/Nav/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import Protected from './pages/Protected';
import Public from './pages/Public';
import { ProvideAuth } from './services/Auth';
import PrivateRoute from './services/PrivateRoute';

function App() {

  return (
    <ProvideAuth>
      <Router>
        <div className="App">
          <Nav/>

          <ul>
            <li>
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul>
          
          <Switch>
          <Route exact path="/">
            <Home />
          </Route>
            <Route path='/login'>
              <Login/>
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
