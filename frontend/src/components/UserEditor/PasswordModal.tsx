import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import s from "./PasswordModal.module.scss";

interface Props {
  setPassword(value: string): void,
  closeModal(): void;
}

export default function PasswordModal(props: Props) {

  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  function handleEsc(e: KeyboardEvent) {
    if(e.key == "Escape") {
      props.closeModal()
    }
  }

  useEffect(()=>{
    document.addEventListener("keydown", handleEsc, false);
    return () => document.removeEventListener("keydown", handleEsc, false);
  }, [])


  function savePassword(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(password === passwordRepeat) {
      props.setPassword(password)
    } else {
      setErrorText("Die Passwörter stimmen nicht überein.");
    }
  }
  
  function handleOutsideClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if(e.target === e.currentTarget) {
      props.closeModal();
   }
  }


  return (
    <div id="password_modal_wrapper" className={s.wrapper} onClick={e => handleOutsideClick(e)}>
      <div className={s.inner}>
        <form id="passwordform" onSubmit={e => savePassword(e)}>
          <TextInput
            label="PASSWORD"
            type="password"
            placeholder="*******"
            value={password}
            minLength={8}
            required
            onChange={e => setPassword(e.target.value)}
          />
          <TextInput
            label="PASSWORD"
            type="password"
            placeholder="*******"
            minLength={8}
            required
            value={passwordRepeat}
            onChange={e => setPasswordRepeat(e.target.value)}
          />
          <p className={s.error}>
            {errorText}

          </p>

          <div className={s.bottomButtons}>
            <Button
              onClick={props.closeModal}
            >ABBRECHEN</Button>
            <Button
              type="submit"
              value="SPEICHERN"
              color="dark"
            />

          </div>
        </form>

        {/* <label htmlFor="password_input">PASSWORD</label>
        <input type="password" id="password_input" />
        <label htmlFor="password_repeat_input">PASSWORD WIEDERHOLEN</label>
        <input type="password" name="password" id="password_repeat_input" /> */}
      </div>
    </div>
  )
}