import React, { useEffect, useRef, useState } from 'react';
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import DashNav from '../Nav/DashNav';
import TextInput from '../TextInput/TextInput';

import s from './PostEditor.module.scss';
import Button from '../Button/Button';

interface Props {

}

const PostEditor: React.FunctionComponent = () => {
  const [text, setText] = useState("# Hello there \ \n yes.")
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [textAreaHeight, setTextAreaHeight] = useState("auto");
	const [parentHeight, setParentHeight] = useState("auto");

  const processor = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(rehype2react, { createElement: React.createElement })


  useEffect(() => {
    setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
    setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`);
  }, [text]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaHeight("auto");
		setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
		setText(e.target.value);
  }

  return (
    <div className={s.postEditor}>
      <div className={s.main}>
        <DashNav />

        <TextInput
          label="Titel"
          placeholder="Ein interessantes Projekt"
        />

        <div className={s.editor}>
          <div className="textareaWrapper" 
            style={{minHeight: parentHeight}}
          >
            <textarea
              value={text}
              ref={textAreaRef}
              onChange={e => handleInput(e)}
              style={{height: textAreaHeight}}
            >
            </textarea>
          </div>

          <div className={s.output}>
            {
              // @ts-ignore
              processor.processSync(text).result as ReactNode
            }
          </div>
        </div>
      </div>
      <div className={s.sidebar}>
        <div className={s.top}>
          <p>hier das thumbnail</p>
        </div>
        <div className={s.bottom}>
          <Button>Abbrechen</Button>
          <Button color="light">Speichern</Button>
        </div>
      </div>
    </div>
  )
}

export default PostEditor;