import React from 'react';
import Layout from '../../components/Layout/Layout';
import NavBar from '../../components/Nav/NavBar';
import PostList from '../../components/PostList/PostList';
import { useAuth } from '../../services/Auth';
import s from './Dashboard.module.scss'

export default function Dashboard() {
  const auth = useAuth();

  return (
    <Layout>
      <div className={s.dashboard}>
        <main>
          <NavBar />
          <div className={s.content}>
            <PostList/>
          </div>
        </main>

        <div className={s.notifications} >
          <p>Hallo <b>{auth.user?.username}</b>!</p>
        </div>
      </div>
    </Layout>
  )
}