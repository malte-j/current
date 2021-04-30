import React from "react";
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
    </ContentWrapper>
    
  </div>
}