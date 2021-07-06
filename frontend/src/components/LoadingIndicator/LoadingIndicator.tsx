import React from "react";
import s from './LoadingIndicator.module.scss'

const LoadingIndicator:React.FunctionComponent = ({children}) => {
  return (
    <div className={s.loadingIndicator}>
      <div className={s.spinner}></div>
      <span>{children}</span>
    </div>
  )
}

export default LoadingIndicator;