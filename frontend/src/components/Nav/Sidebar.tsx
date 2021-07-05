import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import s from './Sidebar.module.scss';

interface SidebarProps {
  className?: string
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({className}) => {
  return (
    <aside className={`${s.sidebar} ${className? className : ""}`}>
      <ul>
        <li><NavLink to="/dashboard">Überblick</NavLink></li>
        <NavLink to='/users'>Nutzerverwaltung</NavLink>
        <li><NavLink to="/me">Mein Profil</NavLink></li>
        <li><Link to="/projects">Meine Projekte</Link>
          <ul>
            <li><a href="#">Projekt hinzufügen</a></li>
            <li><a href="#">Elektronikkram und so anderer kram</a></li>
            <li><a href="#">Sehr gutes Projekt</a></li>
          </ul>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar;