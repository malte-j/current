import React from 'react';
import s from './TextInput.module.scss'

interface TextInputProps {
  type?: 'password' | 'text' | 'search',
  id?: string,
  name?: string,
  required?: boolean,
  placeholder?: string,
  label?: string,
  value?: string,
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void
}

export default function TextInput({type = "text", id, name, required, placeholder, label, value, onChange}:TextInputProps) {
  return <div className={`${s[type]}`}>
    {
      type == 'search' ? 
      <img className={s.icon} src="/icons/magnifying_glass.svg" alt="search icon"/>
      : undefined
    }

    {
      label ?
      <label htmlFor={ id } className={s.labelElement}>{ label }</label>
      :undefined
    }

    <input
      type={type}
      id={id}
      placeholder={placeholder} 
      required={required}
      className={s.inputElement} 
      value={value}
      onChange={onChange}
    />
  </div>
}