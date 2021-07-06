import React, { useContext, createContext, useState, FunctionComponent } from "react";

interface AuthContext {
  user: User | undefined,
  signin: SigninFunction,
  signout: SignoutFunction,
  signup(username:string, email:string, password:string): Promise<User | undefined>
}

interface SigninFunction {
  (username: string, password: string): Promise<User> 
}

interface SignoutFunction {
  ():Promise<void> 
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const fakeAuth = {
  isAuthenticated: false,
  bearer: '',

  async signin(username: string, password:string):Promise<User> {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Authorization': `Basic ${btoa(username + ':' + password)}`
      },
    })

    if(!res.ok)
      throw new Error(await res.json())

    let signedInUser = await res.json();
    fakeAuth.bearer = res.headers.get('Authorization') as string;
    fakeAuth.isAuthenticated = true;

    return {
      ...signedInUser,
      authToken: fakeAuth.bearer 
    };
  },
  async signup(username:string, email:string, password:string):Promise<User | undefined> {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/users', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email
      })
    })

    let newUser = await res.json();
    fakeAuth.bearer = res.headers.get('Authorization') as string;
    fakeAuth.isAuthenticated = true;

    return {
      ...newUser,
      authToken: fakeAuth.bearer 
    };

  },
  async signout() {
    await sleep(2000);

    fakeAuth.isAuthenticated = false;
  }
};

//@ts-ignore
const authContext = createContext<AuthContext>();

export const ProvideAuth: FunctionComponent = ({ children }) => {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = ():AuthContext => useContext<AuthContext>(authContext);

export const useProvideAuth = ():AuthContext => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const signin: SigninFunction = async (username, password) => {
    const newUser = await fakeAuth.signin(username, password);
    setUser(newUser);
    return newUser;
  }

  const signup = async (username:string, email:string, password:string) => {
    const newUser = await fakeAuth.signup(username, email, password);
    setUser(newUser);
    return newUser;
  }

  const signout = async () => {
    setUser(undefined);
    await fakeAuth.signout();
  }

  return {
    user,
    signin,
    signup,
    signout
  };
}