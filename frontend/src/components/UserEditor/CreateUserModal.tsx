import React, { FunctionComponent, useEffect, useState } from "react";
import Modal from '../Modal/Modal';
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import s from "./CreateUserModal.module.scss";
import { NewUser } from "./UserEditor";

interface Props {
  closeModal(): void;
  createUser(newUser: NewUser): void;
}

const CreateUserModal: FunctionComponent<Props> = (props) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  function saveUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password === passwordRepeat) { 
      props.createUser({
        username,
        email,
        isAdmin,
        emailVerified,
        password
      })
    } else {
      setErrorText("Die Passwörter stimmen nicht überein.");
    }
  }


  return (
    <Modal innerWidth="restricted" closeModal={props.closeModal}>
      <h2 className={s.title}>Nutzer hinzufügen</h2>

      <form className={s.form} id="passwordform" onSubmit={e => saveUser(e)}>

        <TextInput
          label="USERNAME"
          type="text"
          placeholder="exampleuser123"
          value={username}
          required
          onChange={e => setUsername(e.target.value)}
          autocomplete={false}
        />
        <TextInput
          label="EMAIL"
          type="email"
          placeholder="mail@example.com"
          value={email}
          required
          autocomplete={false}
          onChange={e => setEmail(e.target.value)}
        />
        
        <div className={s.select}>
          <label htmlFor="newUser_role">ROLLE</label>
          <select id="newUser_role" name="select" onChange={(e)=>setIsAdmin(e.target.value == "true")}>
            <option value="false">User</option>
            <option value="true">Admin</option>
          </select>
          
        </div>

        <div className={s.toggle}>                
          <label className={s.label} htmlFor="newUser_IsVerified">EMAIL VERIFIED</label>
          <input type="checkbox" name="verified" id="newUser_IsVerified" checked={emailVerified} onChange={(e) => setEmailVerified(e.target.checked)} />
          <label htmlFor="newUser_IsVerified">{emailVerified?"JA":"NEIN"}</label>
        </div>

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
          label="PASSWORD WIEDERHOLEN"
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

export default CreateUserModal;