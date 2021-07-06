import React from 'react';
import s from './TextInput.module.scss'

export interface TextInputProps {
  type?: 'password' | 'text' | 'search' | 'email',
  id?: string,
  name?: string,
  required?: boolean,
  placeholder?: string,
  label?: string,
  value?: string,
  minLength?: number,
  className?: string,
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void
}

export default function TextInput({type = "text", id, minLength, name, required, placeholder, label, value, onChange, className = ""}:TextInputProps) {
  return <div className={`${s[type]} ${className}`}>
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
      minLength={minLength}
    />
  </div>
}