import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import Nav from "../../components/Nav/Nav";
import s from './Home.module.scss';


export default function Home() {
  const click = async () => {
    let f = await fetch('http://localhost:3000/users')
    console.log(f);
    
  }

  return <div className={s.home}>
    <ContentWrapper>
      <Nav/>
      <Button color="light">
        <Link to="/dashboard">Zum Dashboard</Link>
      </Button>

    </ContentWrapper>
    
  </div>
}