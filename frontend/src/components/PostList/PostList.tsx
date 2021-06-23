import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/Auth';
import s from './PostList.module.scss';

interface Props {
  user?: string
}

const PostList:React.FunctionComponent<Props> = (props) => {
  const auth = useAuth();
  const posts = useQuery<Post[], Error>(['posts'], async () => {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/?preview=true', {
      method: 'GET',
      headers: {
        'Authorization': auth.user!.authToken
      }
    })

    return await res.json();
  })

  return (
    <div className={s.postList}>
      {
        posts.isLoading ? 
        <p>lade Projekte...</p>
        : <>
          {posts.data?.map(post => (
            <article>
              <Link to={`/projects/${post._id}`} key={post._id}>
                <h2>{post.title}</h2>
              </Link> 
            </article>
          ))}
        </>
      }
    </div>
  )  
}

export default PostList;