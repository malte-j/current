import { QueryFunctionContext, QueryKey } from "react-query"

export async function getPost({ queryKey }: QueryFunctionContext<QueryKey, any>) : Promise<Partial<Post>> {
  const [_key, postId] = queryKey;

  if(typeof postId != "string") {
    throw new Error("PostId has wrong format");
  }

  const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/posts/' + postId, {
    method: 'GET'
  })
  
  if (!res.ok) {
    // @TODO: check if we can get error messages here
    throw new Error('Error fetching post')
  }

  return res.json()
}

export async function getPosts({ queryKey }: QueryFunctionContext<QueryKey, any>) {
  const [_key, postSearchArguments] = queryKey
  let params = new URLSearchParams();
  params.set('preview', 'true');

  if(typeof postSearchArguments != "undefined" && typeof (postSearchArguments as any).user == "string") {
    params.set('user', (postSearchArguments as any).user);
  }

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts?${params.toString()}` , {
    method: 'GET'
  })

  if (!res.ok) {
    throw new Error('Error fetching post')
  }

  return await res.json();
}