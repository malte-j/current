import React from "react";
import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../services/Auth";
import s from './Post.module.scss'
import Button from "../Button/Button";
import { useUser } from "../../services/Users.service";
import Image from '../Image/Image';
import { getPost } from "../../services/Posts.service";

const Post: React.FunctionComponent = () => {
  const { postId } = useParams<{ postId?: string }>();
  const auth = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  const post = useQuery<Partial<Post>, Error>(['post', postId], getPost, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: () => {
      const previewData = queryClient.getQueryData<PostPreview[]>('posts')?.find((post) => post._id === postId)
      return {
        _id: previewData?._id,
        _user: previewData?._user._id,
        createdAt: previewData?.createdAt,
        title: previewData?.title,
        _thumbnail: previewData?._thumbnail
      }
    }
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

            {
              post.data?._thumbnail ?
                <div className={s.thumbnail}>
                  <Image
                    imageMeta={post.data?._thumbnail}
                    sizes={[
                      "(min-width: 700px) 700px",
                      "(max-width: 700px) 99vw"
                    ]}
                    widths={[
                      1340,
                      700,
                      400,
                      300
                    ]}
                    aspectRatio={16 / 9}
                  />
                </div>
                : null
            }
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
                post.data?.markdownBody ?
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