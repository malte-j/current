import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../services/Auth";
import Button from "../Button/Button";
import s from './DashNav.module.scss'

interface DashNavProps {

}

export default function DashNav(props: DashNavProps) {
  let auth = useAuth();
  let [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`${s.nav} ${menuOpen? s.menuOpen : ''}`}>
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
        </div>

        <div className={s.bottom}>
          <a href="#" onClick={e=>{e.preventDefault(); auth.signout()}}>Abmelden</a>
        </div>
      </div>
    </nav>
  )
}