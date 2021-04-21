import Post from '../../models/Post'

// READ multiple Post
export async function getPosts(user, skip, limit) {
  let searchSettings = {}

  if(user)
    searchSettings.user = user;
  
  let sortOptions = {
    sort: {
      date: "desc"
    }
  } 
  
  if(limit) 
    sortOptions.limit = limit;

  if(skip)
    sortOptions.skip = skip;

  return Post.find(searchSettings, "_user title markdownBody _thumbnail createdAt", sortOptions).exec()
}


// READ single Post by id
export async function getPostById(_id) {
  return Post.findById(_id);
}


// CREATE Post
export async function createPost(title, markdownBody, _user, _thumbnail) {
  let newPost = new Post();
  newPost.title = title;
  newPost.markdownBody = markdownBody;
  newPost._user = _user; 
  newPost._thumbnail = _thumbnail;
  return newPost.save();
}

// DELETE Post 
export async function deletePost(_id, user) {
  let post = await Post.findById(_id)

  if(!post)
    throw new Error("Post not found");
  
  if(!post._user.equals(user._id) && !user.isAdmin)
    throw new Error("Not authorized")
      
  return Post.deleteOne({
    _id: _id
  })
}

// UPDATE Post
export async function updatePost(_id, title, markdownBody, _thumbnail, user) {
  let post = await Post.findById(_id);

  if(!post)
    throw new Error("Post not found")

  if(!post._user.equals(user._id) && !user.isAdmin)
    throw new Error("Not authorized")

  if(title)
    post.title = title;
  
  if(markdownBody)
    post.markdownBody = markdownBody;

  if(_thumbnail)
    post._thumbnail = _thumbnail;

  return post.save();
}