import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../../components/Button/Button";
import Layout from "../../components/Layout/Layout";
import NavBar from "../../components/Nav/NavBar";
import TextInput from "../../components/TextInput/TextInput";
import s from './VerifyEmail.module.scss';

export default function VerifyEmail() {
  const location = useLocation();
  
  const [inputValue, setInputValue] = useState("");

  useEffect(()=>{
    let u = new URLSearchParams(location.search).get("token")
    if(u)
      setInputValue(u);
  }, [location])


  return (
    <Layout>
      <NavBar/>
      <div className={s.verifyEmail}>
        <TextInput
          label="Bestätigungsnummer"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <Button color="light">Email bestätigen</Button>
      </div>
    </Layout>
  )
}