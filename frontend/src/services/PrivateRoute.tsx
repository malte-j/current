import React, { useContext, createContext, useState, FunctionComponent } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { useAuth } from './Auth';

export default function PrivateRoute({ children, path, exact, ...rest }: {children: React.ReactNode, path: String, exact?: boolean}) {
  let auth = useAuth();
  return (
    <Route
      exact={exact}
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}