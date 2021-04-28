import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../services/Auth";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import s from './Nav.module.scss';


export default function Nav() {
  let history = useHistory();
  let auth = useAuth();

  

  return (
    <nav className={s.nav}>
      <TextInput type='search' placeholder='suchen...' />

      <Link to="/">
        <img src="/logo.svg" alt="current logo" className={ s.logo }/>
      </Link>

      <div className={s.buttons}>
        <Button>
          <Link to='/login'>Anmelden</Link>
        </Button>
        <Button color='light'>
          <Link to='/signup'>Registrieren</Link>
        </Button>
      </div>

      {/* Welcome {auth.user ? auth.user.name : ''}!
      <button

        className={style.signin}
        onClick={async () => {
          await auth.signout();
          history.push("/");
        }}
      >
        Sign out
      </button>
    */}
    </nav>
  ) 
  

}