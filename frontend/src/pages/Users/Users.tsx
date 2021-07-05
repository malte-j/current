import React from 'react';
import Layout from '../../components/Layout/Layout';
import DashNav from '../../components/Nav/DashNav';
import UserEditor from '../../components/UserEditor/UserEditor';
import s from './Users.module.scss'

export default function Dashboard() {
  return (<Layout>
    <main className={s.users}>
      <DashNav />
      <UserEditor />
    </main>
  </Layout>)
}