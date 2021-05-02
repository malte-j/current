import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../services/Auth";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import s from './Nav.module.scss';
import Sidebar from "./Sidebar";

interface NavProps {
  version?: 'dash' | 'default';
}

export default function Nav(props: NavProps) {
  let auth = useAuth();
  let [menuOpen, setMenuOpen] = useState(false);


  return (
    <nav className={`${s.nav} ${menuOpen ? s.menuOpen : ''}`}>
      <TextInput className={s.searchBar} type='search' placeholder='suchen...' />

      <Link to="/">
        <img src="/logo.svg" alt="current logo" className={s.logo} />
      </Link>

      <div className={s.buttons}>
        {
          auth.user ? (
            <Button onClick={() => auth.signout()}>Abmelden</Button>
          ) : <>
            <Link to='/login'>
              <Button>Anmelden</Button>
            </Link>
            <Link to='/signup'>
              <Button color='light'>Registrieren</Button>
            </Link>
          </>
        }
      </div>

      <div className={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        <div className={s.bar}></div>
        <div className={s.bar}></div>
        <div className={s.bar}></div>
      </div>

      <div className={s.menu}>
        {
          auth.user ? <>
            <Link to='/dashboard'>
              <Button color='dark' size="lg" width="100%" >Dashboard</Button>
            </Link>
            <Button color='light' size="lg" onClick={() => auth.signout()}>Abmelden</Button>
          </> : <>
            <Button color='light' size="lg">
              <Link to='/login'>Anmelden</Link>
            </Button>
            <Button color='dark' size="lg">
              <Link to='/signup'>Registrieren</Link>
            </Button>
          </>
        }
      </div>
    </nav>
  )


}