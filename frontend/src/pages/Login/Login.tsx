import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useAuth } from "../../services/Auth";
import TextInput from '../../components/TextInput/TextInput'

import s from './Login.module.scss';
import Nav from "../../components/Nav/Nav";
import Button from "../../components/Button/Button";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";

export default function Login() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  let login: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await auth.signin(username, password);
      console.log("signin complete");

      history.replace(location.state?.from || { pathname: "/" });
    } catch (e) {
      console.log(e)
      console.log("show error to user")
    }
  };

  return (
    <div className={s.wrapper}>
      <ContentWrapper className={s.main}>
        <Nav />
        <div className={s.center}>

          <form onSubmit={login} className={s.form}>
            {location.state?.from ?
              <p>Um <b>{location.state.from.pathname}</b> aufrufen zu können, musst du angemeldet sein:</p>
              : undefined
            }
            <TextInput
              value={username}
              onChange={e => setUsername(e.target.value)}
              id="login_email"
              name="username"
              placeholder="name@example.com"
              label="email"
              type="email"
            />
            <TextInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              id="login_password"
              name="username"
              placeholder="********"
              label="passwort"
              type="password"
            />
            <Button className={s.loginButton} type='submit' color='dark' value='Login' />
          </form>
        </div>
      </ContentWrapper>
    </div>
  );
}