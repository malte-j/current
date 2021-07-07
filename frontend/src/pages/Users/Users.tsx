import React from 'react';
import Layout from '../../components/Layout/Layout';
import NavBar from '../../components/Nav/NavBar';
import UserEditor from '../../components/UserEditor/UserEditor';
import s from './Users.module.scss'

export default function Dashboard() {
  return (<Layout>
    <main className={s.users}>
      <NavBar />
      <UserEditor />
    </main>
  </Layout>)
}