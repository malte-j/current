import React, { useContext, createContext, useState, FunctionComponent } from "react";

interface AuthContext {
  user: User | undefined,
  signin: SigninFunction,
  signout: SignoutFunction
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
    // const res = await fetch('http://localhost:3000/auth', {
    //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //   headers: {
    //     'Authorization': `Basic ${btoa(username + ':' + password)}`
    //   },
    // })

    // let d = await res.json();

    
    // res.headers.forEach(e => console.log(e));

    // fakeAuth.bearer = res.headers.get('Authorization') as string;

    fakeAuth.isAuthenticated = true;
    return {
      email: "example",
      isAdmin: true,
      username: "Example"
    }
    // return d;
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

  const signout = async () => {
    setUser(undefined);
    await fakeAuth.signout();
  }

  return {
    user,
    signin,
    signout
  };
}