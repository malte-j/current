import React, { useRef } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Layout from '../../components/Layout/Layout';
import NavBar from '../../components/Nav/NavBar';
import Post from '../../components/Post/Post';
import PostEditor from '../../components/Post/PostEditor';
import PostList from '../../components/PostList/PostList';
import { useAuth } from '../../services/Auth';
import PrivateRoute from '../../services/PrivateRoute';
import s from './Projects.module.scss'

export default function Dashboard() {
  const auth = useAuth();

  let { path, url } = useRouteMatch();

  return (<Layout>
    <Switch>
      <PrivateRoute exact path={path}>
        <main>
          <NavBar />
          <div className={s.content}>
            <Link to="/projects/new">
              <Button color="light">Neues Projekt erstellen</Button>
            </Link>

            <PostList user={auth.user?.id} />
          </div>
        </main>
      </PrivateRoute>
      
      <Route path={`${path}/new`}>
        <PostEditor/>
      </Route>
      
      <PrivateRoute path={`${path}/:postId/edit`}>
        <PostEditor/>
      </PrivateRoute>

      <Route path={`${path}/:postId`}>
        <NavBar/>
        <Post/>
      </Route>
    </Switch>


  </Layout>)
}