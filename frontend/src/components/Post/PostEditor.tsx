import React, { useEffect, useRef, useState } from 'react';
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import NavBar from '../Nav/NavBar';
import TextInput from '../TextInput/TextInput';

import s from './PostEditor.module.scss';
import Button from '../Button/Button';
import { useAuth } from '../../services/Auth';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Modal from '../Modal/Modal';
import ImageUpload from '../ImageUpload/ImageUpload';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

const PostEditor: React.FunctionComponent = () => {
  // HOOKS
  const [postBody, setPostBody] = useState<string>('')
  const [postTitle, setPostTitle] = useState<string>('');
  const [postThumbnail, setPostThumbnail] = useState<Image | null>(null);

  let { postId } = useParams<{ postId?: string }>();

  const originalPostQuery = useQuery<Post, Error>(['post', postId], async () => {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/' + postId, {
      method: 'GET',
      headers: {
        'Authorization': auth.user!.authToken
      }
    })
    return await res.json();
  }, {
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
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      history.push('/projects');
    }
  })

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  const [parentHeight, setParentHeight] = useState("auto");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentEditorTab, setCurrentEditorTab] = useState<'editor' | 'preview'>('editor');
  const [mobile, setMobile] = useState(window.matchMedia('(max-width: 1000px)').matches);


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
    if (textAreaRef.current) {
      setParentHeight(`${textAreaRef.current.scrollHeight}px`);
      setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
    }
  }, [postBody]);

  useEffect(() => {
    if (originalPostQuery?.data) {
      setPostTitle(originalPostQuery.data.title);
      setPostThumbnail(originalPostQuery.data._thumbnail || null);
      setPostBody(originalPostQuery.data.markdownBody);
    }
  }, [originalPostQuery?.data])

  // listen to window resize
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1000px)');
    const resizeListener = (e: MediaQueryListEvent) => {
      setMobile(e.matches);
    }
    mediaQuery.addEventListener('change', resizeListener);
    return () => mediaQuery.removeEventListener('change', resizeListener);
  }, [])

  // UTILITY FUNCTIONS

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaHeight("auto");
    setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
    setPostBody(e.target.value);
  }

  const savePost = async () => {
    let req;
    if (postId) {
      req = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/' + postId, {
        method: 'PATCH',
        headers: {
          'Authorization': auth.user!.authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: postTitle,
          markdownBody: postBody,
          _thumbnail: postThumbnail ? postThumbnail._id : null
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
          markdownBody: postBody,
          _thumbnail: postThumbnail ? postThumbnail._id : null
        })
      })
    }


    const res = await req.json();

    if (!postId)
      history.push('/projects/' + res._id + '/edit');
  }


// DOM
  return (
    <div className={s.postEditor}>
      {deleteModalOpen ? (
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
      <main>
        <NavBar />
        <div className={s.main}>


          {(originalPostQuery.isLoading) ?
              <LoadingIndicator>lade post...</LoadingIndicator>
            : <>
              {
                mobile ? <div className={s.mobileEditButtons}>
                  <Button
                    onClick={history.goBack}
                  >Abbrechen</Button>
                  <Button
                    color="light"
                    onClick={savePost}
                  >Speichern</Button>

                </div>
                  : null
              }
              <TextInput
                label="Titel"
                placeholder="Ein interessanter Titel..."
                value={postTitle}
                onChange={e => setPostTitle(e.target.value)}
              />

              {
                mobile ? <ImageUpload
                currentImage={postThumbnail}
                setCurrentImage={setPostThumbnail}
              /> : null
              }

              {
                mobile ? (
                  <div className={s.tabs} data-current-tab={currentEditorTab}>
                    <button onClick={() => setCurrentEditorTab('editor')}>Editor</button>
                    <button onClick={() => setCurrentEditorTab('preview')}>Vorschau</button>
                  </div>
                ) : null
              }
              <div className={s.editor} data-current-tab={currentEditorTab}>
                <div className={s.textareaWrapper}
                  style={{ minHeight: parentHeight }}
                >
                  <textarea
                    value={postBody}
                    ref={textAreaRef}
                    onChange={e => handleInput(e)}
                    style={{ height: textAreaHeight }}
                    rows={5}
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
              {
                mobile ? (
                  <Button
                    color="red"
                    onClick={() => setDeleteModalOpen(true)}
                    width="100%"
                  >LÖSCHEN</Button>) : null
              }
            </>
          }
        </div>
      </main>
      
      
      <div className={s.sidebar}>
        <div className={s.top}>
        <ImageUpload
          currentImage={postThumbnail}
          setCurrentImage={setPostThumbnail}
        />
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