import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/Auth';

interface Props {
  user?: string
}

const PostList:React.FunctionComponent<Props> = (props) => {
  const auth = useAuth();
  const posts = useQuery<Post[], Error>(['posts'], async () => {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/', {
      method: 'GET',
      headers: {
        'Authorization': auth.user!.authToken
      }
    })

    return await res.json();
  })

  return (
    <div>
      {
        posts.isLoading ? 
        <p>lade Projekte...</p>
        : <>
        {posts.data?.map(post => (
          <Link to={`/projects/${post._id}`} key={post._id}>
            <h2>{post.title}</h2>
          </Link>
        ))}
        </>
      }
    </div>
  )  
}

export default PostList;