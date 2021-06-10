import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css'
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Users from './pages/Users/Users';
import { ProvideAuth } from './services/Auth';
import PrivateRoute from './services/PrivateRoute';
import RedirectOnAuth from './services/RedirectOnAuth';


const queryClient = new QueryClient();


function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ProvideAuth>
        <Router>
          <div className="app">
            <Switch>
              <Route exact path="/">
                <Home/>
              </Route>

              <RedirectOnAuth path='/login' to="/dashboard">
                <Login/>
              </RedirectOnAuth>
              
              <RedirectOnAuth path='/signup' to="/dashboard">
                <Signup/>
              </RedirectOnAuth>
              


              <PrivateRoute path='/dashboard'>
                <Dashboard/>
              </PrivateRoute>

              <PrivateRoute path='/users'>
                <Users/>
              </PrivateRoute>

              <Route path="*">
                <div>404: nicht Seite existiert nicht</div>
              </Route>

            </Switch>
          </div>
        </Router>
      </ProvideAuth>
    </QueryClientProvider>
  )
}

export default App
