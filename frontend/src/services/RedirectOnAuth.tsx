import React from "react";
import {
  Route,
  Redirect
} from "react-router-dom";
import { useAuth } from './Auth';

export default function RedirectOnAuth({ children, to, ...rest }: {children: React.ReactNode, to: string}) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={() =>
        auth.user ? (
          <Redirect to={to} />
          ) : (
          children
        )
      }
    />
  );
}