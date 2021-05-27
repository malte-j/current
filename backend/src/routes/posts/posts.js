import express from 'express';
import { getPosts, getPostById, createPost, deletePost, updatePost } from './postsService';
import { isAuthenticatedMiddleware } from '../../services/authMiddleware';

const router = express.Router();

/**
 * CREATE Post
 */
router.post('/',
  isAuthenticatedMiddleware,
  async (req, res) => {
    const title = req.body.title;
    const markdownBody = req.body.markdownBody;
    const _thumbnail = req.body.thumbnail;
    const _user = req.user._id;

    try {
      const createdPost = await createPost(title, markdownBody, _user, _thumbnail);
      res.json(createdPost);
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
  async (req, res) => {
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
  async (req, res) => {
    const user = req.query.user;
    const skip = parseInt(req.query.skip)
    const limit = parseInt(req.query.limit);

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
 * UPDATE Post
 */
router.patch('/:postId',
  isAuthenticatedMiddleware,
  async (req, res) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const markdownBody = req.body.markdownBody;
    const _thumbnail = req.body._thumbnail;
    const user = req.user;
    
    try {
      const post = await updatePost(postId, title, markdownBody, _thumbnail, user);
      return res.json(post)
    } catch(e) {
      return res.status(400).send({
        error: e.message
      })
    } 
  }
);


/**
 * DELETE Post
 */
router.delete('/:postId',
  isAuthenticatedMiddleware,
  async (req, res) => {
    const postId = req.params.postId;
    const user = req.user;

    try {
      await deletePost(postId, user);
      return res.json({status: "success"})
    } catch(e) {
      console.log(e)
      return res.status(400).json({error: e})
    }
  }
)

export const postsRouter = router;