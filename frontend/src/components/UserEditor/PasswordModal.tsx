import React, { useEffect, useState } from "react";
import Modal from '../Modal/Modal';
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

  function savePassword(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(password === passwordRepeat) {
      props.setPassword(password)
    } else {
      setErrorText("Die Passwörter stimmen nicht überein.");
    }
  }

  return (
    <Modal innerWidth="restricted" closeModal={ props.closeModal }>
      <form className={s.form} id="passwordform" onSubmit={e => savePassword(e)}>
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
    </Modal>
  )
}