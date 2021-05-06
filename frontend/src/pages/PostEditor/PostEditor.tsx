import React from 'react';
import s from 'PostEditor.module.scss';
import Sidebar from '../../components/Nav/Sidebar';
import TextInput from '../../components/TextInput/TextInput';
import DashNav from '../../components/Nav/DashNav';

export default function PostEditor() {
  return (
    <div className={s.postEditor}>
      <Sidebar/>
      <main>
        <DashNav/>

        <TextInput label="titel" placeholder="Ein großartiges Projekt" name="post_title" id="post_title"/>
      </main>
      <aside>
      </aside>
    </div>
  )  
}