import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import Nav from "../../components/Nav/Nav";
import PostList from "../../components/PostList/PostList";
import s from './Home.module.scss';


export default function Home() {
  return <div className={s.home}>
    <ContentWrapper>
      <Nav/>
      {/* <Button color="light">
        <Link to="/dashboard">Zum Dashboard</Link>
      </Button> */}
      <PostList/>
    </ContentWrapper>
    
  </div>
}