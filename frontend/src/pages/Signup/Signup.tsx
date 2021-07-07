import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useAuth } from "../../services/Auth";
import TextInput from '../../components/TextInput/TextInput'

import s from './Signup.module.scss';
import NavBar from "../../components/Nav/NavBar";
import Button from "../../components/Button/Button";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";

export default function Signup() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");


  let signup: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // @TODO: Hier Registrierung einbauen
    if(password !== passwordRepeat)
      throw new Error("e");

    try {
      await auth.signup(username, email, password);
      console.log("signin complete");

      history.replace(location.state?.from || { pathname: "/dashboard" });
    } catch (e) {
      console.log(e)
      console.log("show error to user")
    }
  };

  return (
    <div className={s.wrapper}>
      <ContentWrapper className={s.main}>
        <NavBar />
        <div className={s.center}>

          <form onSubmit={signup} className={s.form}>
            {location.state?.from ?
              <p>Um <b>{location.state.from.pathname}</b> aufrufen zu können, musst du angemeldet sein:</p>
              : undefined
            }
            <TextInput
              value={username}
              onChange={e => setUsername(e.target.value)}
              id="login_username"
              name="username"
              placeholder="Max Mustermann"
              label="name"
              required
            />
            <TextInput
              value={email}
              onChange={e => setEmail(e.target.value)}
              id="login_email"
              name="email"
              type="email"
              placeholder="name@example.com"
              label="email"
              required
            />
            <TextInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              id="login_password"
              name="username"
              placeholder="********"
              label="passwort"
              type="password"
              required
            />
            <TextInput
              value={passwordRepeat}
              onChange={e => setPasswordRepeat(e.target.value)}
              id="login_password_repeat"
              name="passwordRepeat"
              placeholder="********"
              label="passwort"
              type="password"
              required
            />
            <Button className={s.signupButton} type='submit' color='dark' value='Registrieren' />
          </form>
        </div>
      </ContentWrapper>
    </div>
  );
}