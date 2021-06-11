import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useAuth } from "../../services/Auth";
import PasswordModal from "./PasswordModal";
import s from './UserEditor.module.scss';

interface TempUser extends User {
  modified: boolean,
  password?: string

}

export default function UserEditor() {
  const auth = useAuth();
  
  const [usersRes, setUsersRes] = useState<User[]>([]);
  const [users, setUsers] = useState<TempUser[]>([]);

  const [passwordModal, setPasswordModal] = useState<JSX.Element | null>(null);

  const getUsers = async () => {
    if(!auth.user)
        return;
    const res = await fetch('http://localhost:3000/users', {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Authorization': auth.user.authToken
      }
    })
    let jsonRes = await res.json();

    return jsonRes.map((usr:any) => ({
      ...usr,
      id: usr._id
    }))
  }  

  useEffect(()=>{
    console.log()
    const get = async ()=>{
      if(!auth.user)
        return;
      const res = await fetch('http://localhost:3000/users', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Authorization': auth.user.authToken
        }
      })
      let jsonRes = await res.json();

      setUsersRes(jsonRes.map((usr:any) => ({
        ...usr,
        id: usr._id
      })));
    }

    get();
    }, []
  )

  useEffect(() => {
    setUsers(usersRes.map(user => ({
      ...user,
      modified: false,
      password: undefined
    })))
  }, [usersRes])

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

  function clearModifiedUser(userId: string) {
    setUsers(users.map(user=>{
      if(user.id == userId) {
        let originalUser = usersRes.find(user => user.id == userId) as User;

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

  return (
    <div className={s.editor}>
      {
        passwordModal
      }
      
      {
        users.map(user => (
          <form key={user.id} onSubmit={e => {e.preventDefault(); console.log(e)}} id={`form_${user.id}`}>
          </form>

        ))
      }

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
                    {/* <span>ABBRUCH</span> */}
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
                  <select name="select" onChange={(e)=>setIsAdmin(user.id, e.target.value)}>
                    <option value="true">Admin</option>
                    <option value="false">User</option>
                  </select>
                </td>

                <td>                
                  <input type="checkbox" name="verified" id="input_checkbox" checked={user.emailVerified} onChange={(e)=>setEmailVerified(user.id, e.target.checked)} />
                  <label htmlFor="input_checkbox">{user.emailVerified?"JA":"NEIN"}</label>
                </td>
                <td className={s.label}>PASSWORD</td>
                <td className={s.label}></td>
                <td><button
                  onClick={e=> setPasswordModal(
                    <PasswordModal
                    closeModal={() => setPasswordModal(null)}
                    setPassword={e => {alert(e) ;setPasswordModal(null) }}
                  />)}
                >
                  ÄNDERN
                </button></td>
                <td className={s.deleteRow}>
                  <button className={s.delete} onClick={e=> alert("delete!")}>LÖSCHEN</button>
                </td>
              </tr>
            })
          }

          
        </tbody>
      </table>
    </div>
  )
}