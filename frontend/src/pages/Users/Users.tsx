import React, { useRef } from 'react';
import DashNav from '../../components/Nav/DashNav';
import Sidebar from '../../components/Nav/Sidebar';
import UserEditor from '../../components/UserEditor/UserEditor';
import { useAuth } from '../../services/Auth';
import s from './Users.module.scss'

export default function Dashboard() {
  const auth = useAuth();

  return (<div className={s.dashboard}>
    <Sidebar />

    <main>
      <DashNav />
      <div className="content">
        <UserEditor />

      </div>
    </main>

    <div className={s.notifications} >
      <p>Hallo, <b>{auth.user?.username}</b>!</p>
    </div>
  </div>)
}