import express from 'express';
import { getUsers, createUser, verifyUserEmail, changePassword, deleteUser } from './usersService'
import { createSessionToken } from '../auth/authService'
import { isAuthenticatedMiddleware, isAdmin } from '../../services/authMiddleware';
import debug from 'debug';
const log = debug('route:users');

const router = express.Router();

/**
 * GET Users
 */
router.get('/', 
isAuthenticatedMiddleware,
  async (req, res) => {
    try {
      let users = await getUsers();
      res.json(users);
    } catch(e) {
      res.status(400).send({error: e})
    }
  }
);


/**
 * CREATE New User
 */
router.post('/',
  async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const unencryptedPassword = req.body.password;

    try {
      const newUser = await createUser(username, email, unencryptedPassword);
      
      // Log user in after account creation
      const { token } = await createSessionToken(newUser.email, newUser.password);
      res.header("Authorization", "Bearer " + token)

      return res.json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        emailVerified: newUser.emailVerified
      });
    } catch (e) {
      return res.status(400).json(e.message)
    }
  }
);


/**
 * UPDATE User password
 */
router.patch('/:userId',
  isAuthenticatedMiddleware,
  async (req, res) => {
    const newPassword = req.body.password;

    try {
      await changePassword(req.params.userId, newPassword, req.user);
      return res.json({status: "success"});
    } catch(e) {
      log(e);
      return res.status(400).json({ error: e.message });
    }
  }
)


/**
 * DELETE User
 */
router.delete('/:userId',
  isAuthenticatedMiddleware,
  async (req, res) => {
    try {
      console.log(req)
      await deleteUser(req.params.userId, req.user);
      return res.json({status: "success"})
    } catch(e) {
      log(e);
      return res.status(400).json({error: e.message});
    }
  }
)


/**
 * UPDATE User email verification status
 */
router.patch('/',
  async (req, res) => {
    try {
      const verifiedUser = await verifyUserEmail(req.body.emailVerificationToken);
      log("user successfully verified: " + verifiedUser.username)

      return res.json({
        status: "success"
      })
    } catch(e) {
      return res.status(400).json({
        error: e.message
      })
    }
  }
)

export const usersRouter = router;