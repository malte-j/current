import React from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import s from './Sidebar.module.scss';

interface SidebarProps {
}

export default function Sidebar() {

  return (
    <aside className={s.sidebar}>
    
      <ul>
        <li><NavLink to="/">Überblick</NavLink></li>
        <li><NavLink to="/me">Mein Profil</NavLink></li>
        <li><a href="#">Meine Projekte</a>
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