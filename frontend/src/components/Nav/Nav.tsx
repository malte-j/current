import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../services/Auth";
import style from './Nav.module.css';

export default function Nav() {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <nav className={style.nav}>
      Welcome {auth.user ? auth.user.name : ''}!
      <button

        className={style.signin}
        onClick={async () => {
          await auth.signout();
          history.push("/");
        }}
      >
        Sign out
      </button>
    </nav>
  ) : (
    <p>You are not logged in.</p>
  );

}