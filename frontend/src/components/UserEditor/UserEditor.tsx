import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useAuth } from "../../services/Auth";
import s from './UserEditor.module.scss';

interface TempUser extends User {
  modified: boolean,
  password?: string

}

export default function UserEditor() {
  const auth = useAuth();
  
  const [usersRes, setUsersRes] = useState<User[]>([]);
  const [users, setUsers] = useState<TempUser[]>([]);


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

  // // Access the client
  // const queryClient = useQueryClient();
 
  // // Queries
  // const query = useQuery('usersReq', getUsers);


  

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
        username: value
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
        password: value
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
        email: value
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
        isAdmin: value == "true"
        }
      } else {
        return user
      }
    }))
  }

  
  function setEmailVerified(userId: string, value: boolean) {
    console.log(value)
    setUsers(users.map(user=>{
      if(user.id == userId) {
        return {
          ...user,
        emailVerified: value
        }
      } else {
        return user
      }
    }))
  }

  return (
    <div className={s.editor}>
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
                <td><button>c</button><button>s</button></td>
                <td><input type="text" value={user.username} onChange={(e)=>setUsername(user.id, e.target.value)} /></td>
                <td><input type="text"  value={user.email} onChange={(e)=>setEmail(user.id, e.target.value)} /></td>
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
                <td><button onClick={e=> alert("change password!")}>ÄNDERN</button></td>
                <td>
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