import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../services/Auth";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import s from './NavBar.module.scss'

export default function NavBar() {
  let auth = useAuth();
  let [menuOpen, setMenuOpen] = useState(false);

  if (auth.user) {
    return (
      <nav className={`${s.nav} ${menuOpen ? s.menuOpen : ''}`}>
        <Link to="/">
          <img src="/logo.svg" alt="current logo" className={s.logo} />
        </Link>

        <div className={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <div className={s.bar}></div>
          <div className={s.bar}></div>
          <div className={s.bar}></div>
        </div>

        <div className={s.menu}>
          <div className={s.top}>
            <NavLink to='/dashboard'>Übersicht</NavLink>
            <NavLink to='/users'>Nutzerverwaltung</NavLink>
            <NavLink to='/profile'>Mein Profil</NavLink>
            <NavLink to='/projects'>Meine Projekte</NavLink>
          </div>

          <div className={s.bottom}>
            <a href="#" onClick={e => { e.preventDefault(); auth.signout() }}>Abmelden</a>
          </div>
        </div>
      </nav>
    )
  } else {
    return (
      <nav className={`${s.nav} ${menuOpen ? s.menuOpen : ''}`} data-signed-in={false}>
        <TextInput className={s.searchBar} type='search' placeholder='suchen...' />

        <Link to="/">
          <img src="/logo.svg" alt="current logo" className={s.logo} />
        </Link>

        <div className={s.loginButtons}>
          <Link to='/login'>
            <Button>Anmelden</Button>
          </Link>
          <Link to='/signup'>
            <Button color='light'>Registrieren</Button>
          </Link>
        </div>

        <div className={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <div className={s.bar}></div>
          <div className={s.bar}></div>
          <div className={s.bar}></div>
        </div>

        <div className={s.menu}>
          <div className={s.top}>
            <Button color='light' size="lg">
              <Link to='/login'>Anmelden</Link>
            </Button>
            <Button color='dark' size="lg">
              <Link to='/signup'>Registrieren</Link>
            </Button>
          </div>
        </div>
      </nav>
    )
  }
}