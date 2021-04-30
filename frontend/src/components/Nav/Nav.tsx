import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../services/Auth";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import s from './Nav.module.scss';

interface NavProps {
  version?: 'dash' | 'default';
  sidebarWrapper?: HTMLElement;
}

export default function Nav(props: NavProps) {
  let history = useHistory();
  let auth = useAuth();
  let [menuOpen, setMenuOpen] = useState(false);

  if(props.version === 'dash')
    return <div>dash</div>
  else
    return (
      <nav className={`${s.nav} ${menuOpen? s.menuOpen : ''}`}>
        <TextInput className={s.searchBar} type='search' placeholder='suchen...' />

        <Link to="/">
          <img src="/logo.svg" alt="current logo" className={s.logo} />
        </Link>

        <div className={s.buttons}>
          <Button>
            <Link to='/login'>Anmelden</Link>
          </Button>
          <Button color='light'>
            <Link to='/signup'>Registrieren</Link>
          </Button>
        </div>

        <div className={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <div className={s.bar}></div>
          <div className={s.bar}></div>
          <div className={s.bar}></div>
        </div>

        <div className={s.menu}>
          <Button color='light' size="lg">
            <Link to='/login'>Anmelden</Link>
          </Button>
          <Button color='dark' size="lg">
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