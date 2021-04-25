import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useAuth } from "../services/Auth";



export default function Login() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const auth = useAuth();

  const { from } = location.state;


  let login = async () => {
    try {
      await auth.signin("malte", "password", from);
      history.replace(from || { pathname: "/" });
    } catch(e) {
      console.log(e)
      console.log("show error to user")
    }
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}