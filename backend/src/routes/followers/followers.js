import express from 'express';
import { followUser, getFollowers, getFollowing, unfollow } from './followersService';
import { isAuthenticatedMiddleware } from '../../services/authMiddleware';
import debug from 'debug';
const log = debug('service:followers');

const router = express.Router();

// Route for following annother user
router.post('/:userToFollow',
  isAuthenticatedMiddleware,
  async (req, res) => {
    try {
      const followEdge = await followUser(req.user._id, req.params.userToFollow);
      return res.json(followEdge); 
    } catch (e) {
      log('error creating follower edge:')
      log(e);
      return res.sendStatus('400');
    }
  }
)

// Route for getting followers
router.get('/:user',
  async (req, res) => {
    try {
      let followers = await getFollowers(req.params.user);
      return res.json(followers);
    } catch(e) {
      log('error getting followers for user:' + req.params.user);
      log(e);
      return res.sendStatus(400);
    }
  }
)

router.get('/following/:user',
  async (req, res) => {
    try {
      let following = await getFollowing(req.params.user);
      return res.json(following);
    } catch(e) {
      log('error getting following for user:' + req.params.user);
      log(e);
      return res.sendStatus(400);
    }
  }
)

router.delete('/:user',
  isAuthenticatedMiddleware,
  async (req, res) => {
    try {
      let following = await unfollow(req.params.user, req.user._id);
      return res.json(following);
    } catch(e) {
      log('error getting unfolling user:' + req.params.user);
      log(e);
      return res.sendStatus(400);
    }
  }
)


export const followersRouter = router;