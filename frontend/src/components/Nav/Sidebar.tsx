import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../services/Auth';
import s from './Sidebar.module.scss';

interface SidebarProps {
  className?: string
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({className}) => {
  const auth = useAuth();

  return (
    <aside className={`${s.sidebar} ${className? className : ""}`} >
      <ul className={s.top}>
        <li><NavLink to="/dashboard">Überblick</NavLink></li>
        {
          auth.user?.isAdmin ? 
          <li><NavLink to='/users'>Nutzerverwaltung</NavLink></li>
          : null
        }
        <li><NavLink to="/me">Mein Profil</NavLink></li>
        <li><Link to="/projects">Meine Projekte</Link>
          <ul>
            <li><NavLink to="/projects/new">+ Projekt hinzufügen</NavLink></li>
            <li><a href="#">Elektronikkram und so anderer kram</a></li>
            <li><a href="#">Sehr gutes Projekt</a></li>
          </ul>
        </li>
      </ul>
      <div className={s.bottom}>
        <a href="#" onClick={e=>{e.preventDefault(); auth.signout()}}>Abmelden</a>
      </div>
    </aside>
  )
}

export default Sidebar;