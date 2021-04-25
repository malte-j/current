import React, { useContext, createContext, useState, FunctionComponent } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

interface AuthContext {
  user: User | undefined,
  signin: SigninFunction,
  signout: SignoutFunction
}

interface SigninFunction {
  (username: string, password: string, from?:LocationState['from']): Promise<User> 
}

interface SignoutFunction {
  ():Promise<void> 
}

const fakeAuth = {
  isAuthenticated: false,
  async signin(username: string, password:string):Promise<User> {
    fakeAuth.isAuthenticated = true;
    return {name: "Malte"};
  },
  async signout() {
    fakeAuth.isAuthenticated = false;
  }
};

//@ts-ignore
const authContext = createContext<AuthContext>();

export const ProvideAuth:FunctionComponent = ({ children }) => {
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

  const signin:SigninFunction = async (username, password, from) => {
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