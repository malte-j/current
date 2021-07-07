import React from "react";
import Layout from "../../components/Layout/Layout";
import NavBar from "../../components/Nav/NavBar";
import PostList from "../../components/PostList/PostList";
import s from './Home.module.scss';


export default function Home() {
  return <Layout>
    <div className={s.home}>
      <NavBar />
      <div className={s.posts}>
        <PostList/>
      </div>
    </div>
  </Layout>
}