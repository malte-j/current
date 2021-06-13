import React, { useEffect, FunctionComponent } from "react";
import s from "./Modal.module.scss";

interface Props {
  closeModal(): void;
}

const Modal : FunctionComponent<Props> = (props) => {
  function handleEsc(e: KeyboardEvent) {
    if(e.key == "Escape") {
      props.closeModal()
    }
  }

  useEffect(()=>{
    document.addEventListener("keydown", handleEsc, false);
    return () => document.removeEventListener("keydown", handleEsc, false);
  }, [])
  
  function handleOutsideClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if(e.target === e.currentTarget) {
      props.closeModal();
   }
  }


  return (
    <div id="password_modal_wrapper" className={s.wrapper} onClick={e => handleOutsideClick(e)}>
      <div className={s.inner}>
      
        { props.children }

      </div>
    </div>
  )
}

export default Modal;