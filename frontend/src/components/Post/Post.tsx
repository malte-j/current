import React from "react";
import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import { useQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../services/Auth";
import s from './Post.module.scss'
import Button from "../Button/Button";
import { useUser } from "../../services/User";

const Post: React.FunctionComponent = () => {
  const { postId } = useParams<{postId?: string}>();
  const auth = useAuth();
  const location = useLocation();

  const post  = useQuery<Post, Error>(['post', postId], async () => {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/' + postId, {
      method: 'GET',
      headers: {
        'Authorization': auth.user!.authToken
      }
    })

    return await res.json();
  }, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const postUserId = post.data?._user;

  const useReq = useUser(postUserId);

  const processor = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(rehype2react, { createElement: React.createElement })

  return (
    <div className={s.main}>
      <div className={s.post}>
        {post.isLoading ? 
          <h1>Lade Post...</h1>
          : <>
            <h1 className={s.title}>{post.data?.title}</h1>
            <div className={s.infoBar}>
              <p className={s.user}>{useReq.data?.username}</p>
              <p className={s.date}>{
                post.data?.createdAt ?
                new Intl.DateTimeFormat('de-DE').format(new Date(post.data.createdAt))
                : ""
              }</p>
              <span></span>
              {
                postUserId == auth.user?.id ?
                <Link to={`${location.pathname}/edit`}>
                  <Button color="light" size="s">bearbeiten</Button>
                </Link>
                : null
              }
            </div>
            <div className={s.content}>
              {
                post.data ?
                processor.processSync(post.data?.markdownBody).result as React.ReactNode
                : null
              }
            </div>
          </>  
      }
      </div>
    </div>
  )
}

export default Post;