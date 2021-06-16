import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import DashNav from '../../components/Nav/DashNav';
import Sidebar from '../../components/Nav/Sidebar';
import { useAuth } from '../../services/Auth';
import s from './MyProjects.module.scss'

export default function Dashboard() {
  const auth = useAuth();
  
  return (<div className={s.dashboard}>
    <Sidebar/>

    <main>
      <DashNav />
      <div className="content">
        <Link to="/users">
          <Button color="light">Neuen Beitrag verfassen</Button>
        </Link>
      </div>
    </main>

    <div className={s.notifications} >
      <p>Hallo, <b>{auth.user?.username}</b>!</p>
    </div>
  </div>)
}