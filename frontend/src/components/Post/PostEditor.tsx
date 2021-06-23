import React, { useEffect, useRef, useState } from 'react';
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import DashNav from '../Nav/DashNav';
import TextInput from '../TextInput/TextInput';

import s from './PostEditor.module.scss';
import Button from '../Button/Button';
import { useAuth } from '../../services/Auth';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Modal from '../Modal/Modal';

interface Props {
  postId?: string;
}

const PostEditor: React.FunctionComponent = () => {

  // HOOKS

  const [postBody, setPostBody] = useState<string>('')
  const [postTitle, setPostTitle] = useState<string>('');

  let { postId } = useParams<{postId?: string}>();

  const originalPostQuery = useQuery<Post, Error>(['post', postId], async () => {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/' + postId, {
      method: 'GET',
      headers: {
        'Authorization': auth.user!.authToken
      }
    })

    return await res.json();
  },
  {
    enabled: postId ? true : false,
  })

  const queryClient = useQueryClient();

  const deletePost = useMutation(async () => {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/' + postId, {
      method: 'DELETE',
      headers: {
        'Authorization': auth.user!.authToken
      }
    })

    return res;
  }, {
    onSuccess: ()=>{
      queryClient.invalidateQueries('posts');
      history.push('/projects');
    }
  })

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  const [parentHeight, setParentHeight] = useState("auto");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); 


  const history = useHistory();
  const auth = useAuth();

  const processor = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(rehype2react, { createElement: React.createElement })


  // EFFECTS  

  /**
   *  Resize textarea on input
   */
  useEffect(() => {
    if(textAreaRef.current) {
      setParentHeight(`${textAreaRef.current.scrollHeight}px`);
      setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
    }
  }, [postBody]);

  useEffect(() => {
    if (originalPostQuery?.data) {
      setPostTitle(originalPostQuery.data.title);
      setPostBody(originalPostQuery.data.markdownBody);
    }
  }, [originalPostQuery?.data])


  // UTILITY FUNCTIONS

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaHeight("auto");
    setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
    setPostBody(e.target.value);
  }

  const savePost = async () => {
    let req;
    if(postId) {
      req = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/' + postId, {
        method: 'PATCH',
        headers: {
          'Authorization': auth.user!.authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: postTitle,
          markdownBody: postBody
        })
      })
    } else {
      req = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/', {
        method: 'POST',
        headers: {
          'Authorization': auth.user!.authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: postTitle,
          markdownBody: postBody
        })
      })
    }


    const res = await req.json();

    if(!postId)
      history.push('/projects/' + res._id + '/edit');
  }

  // DOM

  return (
    <div className={s.postEditor}>
      <div className={s.main}>
        <DashNav />

        { deleteModalOpen ? (
            <Modal closeModal={() => setDeleteModalOpen(false)}>
              <p>Willst du den Post wirklich löschen?</p>
              <div className={s.buttonBar}>
                <Button onClick={() => setDeleteModalOpen(false)}>Abbrechen</Button>
                <Button onClick={() => deletePost.mutate()} color="red">Löschen</Button>
              </div>
            </Modal>
          )
          : undefined
        }
          

        {(originalPostQuery && originalPostQuery.isLoading) ?
          <h2>lade post...</h2>
          : <>
            <TextInput
              label="Titel"
              placeholder="Ein interessanter Titel..."
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
            />

            <div className={s.editor}>
              <div className="textareaWrapper"
                style={{ minHeight: parentHeight }}
              >
                <textarea
                  value={postBody}
                  ref={textAreaRef}
                  onChange={e => handleInput(e)}
                  style={{ height: textAreaHeight }}
                  placeholder="Schreibe etwas..."
                >
                </textarea>
              </div>

              <div className={s.output}>
                {
                  processor.processSync(postBody).result as React.ReactNode
                }
              </div>
            </div>

          </>
        }

      </div>
      <div className={s.sidebar}>
        <div className={s.top}>
          <p>hier das thumbnail</p>
        </div>
        <div className={s.bottom}>
          <Button
            color="red"
            onClick={() => setDeleteModalOpen(true)}
          >
            LÖSCHEN
          </Button>
        </div>
        <div className={s.bottom}>
          <Button
            onClick={history.goBack}
          >Abbrechen</Button>
          <Button
            color="light"
            onClick={savePost}
          >
            Speichern
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PostEditor;