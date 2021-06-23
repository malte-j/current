import React, { useEffect, FunctionComponent } from "react";
import s from "./Modal.module.scss";

interface Props {
  closeModal(): void;
  innerWidth?: "restricted" | "full" | "fit"
}

const Modal : FunctionComponent<Props> = ({closeModal, innerWidth, children}) => {
  function handleEsc(e: KeyboardEvent) {
    if(e.key == "Escape") {
      closeModal()
    }
  }

  useEffect(()=>{
    document.addEventListener("keydown", handleEsc, false);
    return () => document.removeEventListener("keydown", handleEsc, false);
  }, [])
  
  function handleOutsideClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if(e.target === e.currentTarget) {
      closeModal();
   }
  }


  return (
    <div className={s.wrapper} onClick={e => handleOutsideClick(e)}>
      <div className={`${s.inner} ${innerWidth ? s[innerWidth] : ''}`}>
      
        { children }

      </div>
    </div>
  )
}

export default Modal;