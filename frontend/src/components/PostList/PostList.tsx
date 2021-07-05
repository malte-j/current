import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/Auth';
import s from './PostList.module.scss';
import Image from '../Image/Image';

interface Props {
  user?: string
}

const PostList: React.FunctionComponent<Props> = (props) => {
  const auth = useAuth();
  const posts = useQuery<PostPreview[], Error>(['posts'], async () => {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/?preview=true', {
      method: 'GET',
      headers: {
        'Authorization': auth.user ? auth.user?.authToken: ""
      }
    })

    return await res.json();
  }, {
    refetchOnWindowFocus: false
  })

  return (
    <div className={s.postList}>
      {
        posts.isLoading ?
          <p>lade Projekte...</p>
          : <>
            {posts.data?.map(post => (
              <Link to={`/projects/${post._id}`} key={post._id}>
                <article key={post._id} data-no-thumbnail={post._thumbnail == null}>
                  <div className={s.header}>
                    <span>{(new Date(post.createdAt)).toLocaleDateString('de-DE')}</span>
                    <span>{post._user.username}</span>
                  </div>

                  <div className={s.content}>
                    {
                      post._thumbnail ?
                      <Image imageMeta={post._thumbnail} width={560} />
                      : null
                    }
                    <h2>{post.title}</h2>
                  </div>  
                </article>
              </Link>
            ))}
          </>
      }
    </div>
  )
}

export default PostList;