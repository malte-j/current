import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/Auth';
import s from './PostList.module.scss';
import Image from '../Image/Image';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

interface Props {
  user?: string
}

const PostList: React.FunctionComponent<Props> = (props) => {
  const auth = useAuth();

  const queryKey = props.user ? ['posts', {user: props.user}] : ['posts'] 
  let params = new URLSearchParams();
  params.set('preview', 'true');
  if(props.user)
    params.set('user', props.user);

  const posts = useQuery<PostPreview[], Error>(queryKey, async () => {

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts?${params.toString()}` , {
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
          <>
          <LoadingIndicator>Lade Posts...</LoadingIndicator>
          </>
          : posts.data && posts.data.length > 0 ? 
          <>
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
                      <Image
                        imageMeta={post._thumbnail}
                        sizes={[
                          "(min-width: 1200px) calc((100vw -  300px) / 2)",
                          "(min-width: 1000px) 48vw",
                          "95vw"
                        ]}
                        widths={[
                          1400,
                          1200,
                          600,
                          400,
                          300
                        ]}
                        aspectRatio={16 / 9}
                       />
                      : null
                    }
                    <h2>{post.title}</h2>
                  </div>  
                </article>
              </Link>
            ))}
          </>
          : <>
          <p>Keine Posts gefunden</p>
          </> 

      }
    </div>
  )
}

export default PostList;