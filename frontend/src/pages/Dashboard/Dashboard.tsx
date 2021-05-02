import React, { useRef } from 'react';
import DashNav from '../../components/Nav/DashNav';
import Sidebar from '../../components/Nav/Sidebar';
import { useAuth } from '../../services/Auth';
import s from './Dashboard.module.scss'

export default function Dashboard() {
  const auth = useAuth();
  
  return (<div className={s.dashboard}>
    <Sidebar/>

    <main>
      <DashNav />
      <div className="content">
        content
      </div>
    </main>

    <div className={s.notifications} >
      <p>Hallo, <b>{auth.user?.username}</b>!</p>
    </div>
  </div>)
}