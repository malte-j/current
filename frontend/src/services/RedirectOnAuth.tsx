import React from "react";
import {
  Route,
  Redirect
} from "react-router-dom";
import { useAuth } from './Auth';

export default function RedirectOnAuth({ children, to, path }: {children: React.ReactNode, to: string, path: string}) {
  let auth = useAuth();
  return (
    <Route path={path}
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