import React, { useRef } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import Button from '../../components/Button/Button';
import DashNav from '../../components/Nav/DashNav';
import Sidebar from '../../components/Nav/Sidebar';
import Post from '../../components/Post/Post';
import PostEditor from '../../components/Post/PostEditor';
import PostList from '../../components/PostList/PostList';
import { useAuth } from '../../services/Auth';
import s from './Projects.module.scss'

export default function Dashboard() {
  const auth = useAuth();
  let { path, url } = useRouteMatch();


  return (<div className={s.dashboard}>
    <Sidebar />

    <Switch>
      <Route exact path={path}>
        <main style={{padding: "0 2rem"}}>
          <DashNav />
          <div className="content">
            <Link to="/projects/new">
              <Button color="light">Neuen Beitrag verfassen</Button>
            </Link>

            <PostList/>
          </div>
        </main>

        <div className={s.notifications} >
          <p>Hallo, <b>{auth.user?.username}</b>!</p>
        </div>
      </Route>
      
      <Route path={`${path}/new`}>
        <PostEditor/>
      </Route>
      
      <Route path={`${path}/:postId/edit`}>
        <PostEditor/>
      </Route>

      <Route path={`${path}/:postId`}>
        <Post/>
      </Route>
    </Switch>


  </div>)
}