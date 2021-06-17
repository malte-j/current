import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useAuth } from "../../services/Auth";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import CreateUserModal from "./CreateUserModal";
import PasswordModal from "./PasswordModal";
import s from './UserEditor.module.scss';

interface TempUser extends User {
  modified: boolean,
  password?: string
}

export interface NewUser extends Omit<User, 'id' | 'authToken'> {
  password: string
}

export default function UserEditor() {
  const auth = useAuth();
  
  const { status: usersResStatus, data: usersRes, error: usersResError } = useQuery<User[], Error>('users', fetchUsers);
  const [users, setUsers] = useState<TempUser[]>([]);
  
  const [passwordModal, setPasswordModal] = useState<JSX.Element | null>(null);
  const [addUserActive, setAddUserActive] = useState<boolean>(false);

  
  /**
   * Fetch every User
   * @returns All Users
   */
  async function fetchUsers(): Promise<User[]> {
    if(!auth.user)
      throw new Error("Not signed in, this shouldn't happen");
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/users', {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Authorization': auth.user.authToken
      }
    })

    if (!res.ok) {
      throw new Error('Fetching Users failed')
    }

    return res.json();
  }

  /**
   * Create editable users array when fetched users changes
   */
  useEffect(() => {
    if(usersRes)
    setUsers(usersRes.map(user => ({
      ...user,
      modified: false,
      password: undefined
    })))
  }, [usersRes])


  /**
   * Sets the username of a temporary user
   * @param userId ID of the User
   * @param value The new Username
   */
  function setUsername(userId: string, value: string) {
    setUsers(users.map(user=>{
      if(user.id == userId) {
        return {
          ...user,
        username: value,
        modified: true
        }
      } else {
        return user
      }
    }))
  }

  /**
   * Sets the password of a temporary user
   * @param userId ID of the User
   * @param value New password for the User
   */
  function setPassword(userId: string, value: string) {
    setUsers(users.map(user=>{
      if(user.id == userId) {
        return {
          ...user,
        password: value,
        modified: true
        }
      } else {
        return user
      }
    }))
  }

  /**
   * Sets the email of a temporary user
   * @param userId ID of the User
   * @param value Edited email for the User
   */
  function setEmail(userId: string, value: string) {
    setUsers(users.map(user=>{
      if(user.id == userId) {
        return {
          ...user,
        email: value,
        modified: true
        }
      } else {
        return user
      }
    }))
  }

  /**
   * Sets the Admin Status of a temporary user
   * @param userId ID of the User
   * @param value  Sets the role of the user to admin or user
   */
  function setIsAdmin(userId: string, value: string) {
    setUsers(users.map(user=>{
      if(user.id == userId) {
        return {
          ...user,
        isAdmin: value == "true",
        modified: true
        }
      } else {
        return user
      }
    }))
  }

  /**
   * Sets the email verification status of a temporary user
   * @param userId ID of the User 
   * @param value Set to true if the Users email is verified
   */
  function setEmailVerified(userId: string, value: boolean) {
    setUsers(users.map(user=>{
      if(user.id == userId) {
        return {
          ...user,
        emailVerified: value,
        modified: true
        }
      } else {
        return user
      }
    }))
  }


  /**
   * Resets a modified temporary user to the original state 
   * @param userId ID of the user
   */
  function clearModifiedUser(userId: string) {
    setUsers(users.map(user=>{
      if(user.id == userId) {
        let originalUser = usersRes?.find(user => user.id == userId) as User;

        const newTempUser : TempUser = {
          ...originalUser,
          modified: false
        }
        
        return newTempUser; 
      } else {
        return user
      }
    }))
  }

  /**
   * Saves a temporary User
   * @param userId ID of the User
   */
  async function saveUser(userId: string) {
    if(!auth.user)
      return;

    const userToUpdate = users.find(user => user.id == userId);
    if(!userToUpdate)
      throw new Error("User that should be updated could not be found.");

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${userToUpdate.id}`, {
      method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Authorization': auth.user.authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userToUpdate
      })
    })

    let jsonRes = await res.json();

    setUsers(users.map(user => {
      if(user.id == userId) {
        return {
          ...user,
          modified: false
        }
      } else {
        return user;
      }
    }))
  }

  async function deleteUser(userId: string) {
    if(!auth.user)
      return;

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
      method: 'DELETE',
      cache: 'no-cache',
      headers: {
        'Authorization': auth.user.authToken,
      }
    })

    let jsonRes = await res.json();

    setUsers(users.filter(user => user.id !== userId));
  }

  async function createUser(newUser: NewUser) {
    if(!auth.user)
      return;

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Authorization': auth.user.authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })

    let jsonRes = await res.json();

    setUsers([...users, jsonRes])

    setAddUserActive(false);
  }

  return (
    <div className={s.editor}>
      { 
        // The current password modal, is null unless password change requested
        passwordModal
      }

      {
        addUserActive ?
        <CreateUserModal closeModal={() => setAddUserActive(false)} createUser={(user) => createUser(user)} />
        : null
      }
      
      {
        // A form for each user in the table so we can use the native form handling
        users.map(user => (
          <form key={user.id} onSubmit={e => {e.preventDefault(); saveUser(user.id)}} id={`form_${user.id}`}>
          </form>

        ))
      }

      <Button onClick={() => setAddUserActive(true)} className={ s.addUser } color="light">+ Nutzer hinzufügen</Button>


      <table>
        <thead>
          <tr>
            <th></th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th>VERIFIED</th>
            <th>PASSWORD</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(user => {
              return <tr key={user.id}>
                <td className={s.saveButtons} style={{"visibility": user.modified ? "visible" : "hidden"}}>
                  <button onClick={() => clearModifiedUser(user.id)}>
                    <img src="/icons/cancel.svg" alt="cancel" />
                  </button>
                  <input form={`form_${user.id}`} type="submit" value="" id={`submit_${user.id}`}/>
                  <label htmlFor={`submit_${user.id}`}>
                    <img src="/icons/save.svg" alt="cancel" />
                  </label>
                </td>

                <td className={s.label}>NAME</td>
                <td className={s.label}>EMAIL</td>
                <td><input
                  form={`form_${user.id}`}
                  type="text" value={user.username}
                  onChange={(e)=>setUsername(user.id, e.target.value)}
                  pattern="^[a-zA-Z0-9]+([a-zA-Z0-9\-_]){2,14}$"
                  title="Der Nutzername darf nur aus Klein- und Großbuchstaben, Zahlen, '-' und '_' bestehen, und muss zwischen Zwei und 14 Zeichen lang sein."
                /></td>
                <td><input form={`form_${user.id}`} type="email"  value={user.email} onChange={(e)=>setEmail(user.id, e.target.value)} /></td>
                <td className={s.label}>ROLE</td>
                <td className={s.label}>VERIFIED</td>
                <td>
                  <select name="select" value={user.isAdmin ? "true" : "false"} onChange={(e)=>setIsAdmin(user.id, e.target.value)}>
                    <option value="true">Admin</option>
                    <option value="false">User</option>
                  </select>
                </td>

                <td>                
                  <input type="checkbox" name="verified" id={`isVerified_${user.id}`} checked={user.emailVerified} onChange={(e)=>setEmailVerified(user.id, e.target.checked)} />
                  <label htmlFor={`isVerified_${user.id}`}>{user.emailVerified?"JA":"NEIN"}</label>
                </td>
                <td className={s.label}>PASSWORD</td>
                <td className={s.label}></td>
                <td><button
                  onClick={() => setPasswordModal(
                    <PasswordModal
                    closeModal={() => setPasswordModal(null)}
                    setPassword={value => {setPassword(user.id, value) ;setPasswordModal(null) }}
                  />)}
                >
                  ÄNDERN
                </button></td>
                <td className={s.deleteRow}>
                  <button className={s.delete} onClick={() => deleteUser(user.id)}>LÖSCHEN</button>
                </td>
              </tr>
            })
          }

          
        </tbody>
      </table>
    </div>
  )
}