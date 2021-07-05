import React from "react";
import Sidebar from "../Nav/Sidebar";
import s from './Layout.module.scss';

const Layout: React.FunctionComponent = ({children}) => {
  return (
    <div className={s.layout}>
      <Sidebar className={s.sidebar}/>
      <div className={s.main}>
        { children }
      </div>
    </div>
  )
}

export default Layout;