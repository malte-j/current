import Post from '../../models/Post'

/**
 * Gibt alle Posts zurück, und kann durch die Parameter Nutzer, Skip und Limit gefiltert werden.
 * @param {String} user ID of the user to search for 
 * @param {number} skip how many entries should be skipped
 * @param {number} limit limit to n entries
 * @param {number} preview limit to n entries
 */
export async function getPosts({user, skip, limit, preview}) {
  let searchSettings = {}
  let select =  "_user title markdownBody _thumbnail createdAt";

  console.log(user)

  if(user)
    searchSettings._user = user;
  
  let sortOptions = {
    sort: {
      date: "desc"
    }
  } 
  
  if(limit) 
    sortOptions.limit = limit;

  if(skip)
    sortOptions.skip = skip;

  if(preview)
    select = "_user title _thumbnail createdAt"

  let query = Post.find(searchSettings, select, sortOptions)
  
  if(preview)
    query = query.populate('_user', "username _profilePicture")

  return query.populate('_thumbnail', "_id format lqip url").exec()
}


/**
 * Returns a single post
 * @param {string} _id id of the user
 */
export async function getPostById(_id) {
  return (await Post.findById(_id).populate('_thumbnail', "_id format lqip url").exec()).toJSON();

}


/**
 * Creates a new post
 * @param {string} title title of the post
 * @param {string} markdownBody body of the post in markdown format
 * @param {string} _user ID of the user
 * @param {string} _thumbnail ID of the thumbnail image
 */
export async function createPost(title, markdownBody, _user, _thumbnail) {
  let newPost = new Post();
  newPost.title = title;
  newPost.markdownBody = markdownBody;
  newPost._user = _user; 
  newPost._thumbnail = _thumbnail;
  return newPost.save();
}


/**
 * Delete a post
 * @param {string} _id Id of the post
 * @param {string} user Id of the requesting user
 */
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


/**
 * Update a post. If a value is undefined, it does not get saved.
 * @param {string} _id ID of the post
 * @param {string} title title of the post
 * @param {string} markdownBody body of the post in markdown format
 * @param {*} _thumbnail ID of the thumbnail image
 * @param {*} user ID of the user
 */
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

  post._thumbnail = _thumbnail;

  return post.save();
}