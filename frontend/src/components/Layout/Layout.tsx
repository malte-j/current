import React from "react";
import { useAuth } from "../../services/Auth";
import Sidebar from "../Nav/Sidebar";
import s from './Layout.module.scss';

const Layout: React.FunctionComponent = ({children}) => {
  const auth = useAuth();

  return (
    <div className={s.layout} data-signed-in={auth.user != undefined}>
      <Sidebar className={s.sidebar}/>
      <div className={s.main}>
        { children }
      </div>
    </div>
  )
}

export default Layout;