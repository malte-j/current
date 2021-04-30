import React from 'react';
import s from './ContentWrapper.module.scss'

export default function ContentWrapper({children, className=''}: {children: React.ReactNode, className?: string}) {
  return <div className={`${s.wrapper} ${className}`}>{ children }</div>
}