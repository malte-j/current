import express from 'express';
import { getPosts, getPostById, createPost, deletePost, updatePost } from './postsService';
import { isAuthenticated, isAdmin } from '../auth/authService';
const router = express.Router();

/**
 * CREATE Post
 */
router.post('/',
  isAuthenticated,
  async (req, res) => {
    const title = req.body.title;
    const markdownBody = req.body.markdownBody;
    const _thumbnail = req.body._thumbnail;
    const _user = req.user._id;

    try {
      const createdPost = await createPost(title, markdownBody, _user, _thumbnail);
      return createdPost; 
    } catch(e) {
      return res.status(400).json({
        error: e
      })
    }
  }
)


/**
 * READ Post
 */
router.get('/:postId',
  async (req, res, next) => {
    const postId = req.params.postId;

    try {
      return await getPostById(postId);
    } catch(e) {
      return res.status(400).json({error: e})
    }
  }
)


/**
 * READ Posts
 */
router.get('/',
  async (req, res, next) => {
    const user = req.query.user;
    const skip = req.query.skip
    const limit = req.query.limit;

    try {
      const posts = await getPosts(user, skip, limit)
      
      return res.json(posts)
    } catch(e) {
      return res.status(400).send({
        error: e
      })
    } 
  }
);

/**
 * Update Post
 */

router.patch('/:postId',
  async (req, res, next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const markdownBody = req.body.markdownBody;
    const _thumbnail = req.body._thumbnail;
    
    // @TODO: check if post belongs to user

    try {
      const post = await updatePost(postId, title, markdownBody, _thumbnail);
      return res.json(post)
    } catch(e) {
      return res.status(400).send({
        error: e
      })
    } 
  }
);

/**
 * Delete Post
 */

router.delete('/:postId',
  async (req, res, next) => {
    const postId = req.params.postId;

    if(req.params.userId !== req.user._id && !isAdmin(req))
      return res.status(403).send({error: "not authorized"})
    
    // @TODO: check if post belongs to user

    try {
      return await deletePost(postId);
    } catch(e) {
      return res.status(400).json({error: e})
    }
  }
)

export const postsRouter = router;