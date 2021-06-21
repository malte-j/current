import React from "react";
import { useParams } from "react-router-dom";

const Post: React.FunctionComponent = () => {
  let { postId } = useParams() as any;

  return (
    <div>
      { postId }
    </div>
  )
}

export default Post;