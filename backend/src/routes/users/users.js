import express from 'express';
import { getUsers, createUser, verifyUserEmail, updateUser, deleteUser, findUserByEmail, findUserByIdOrEmail } from './usersService'
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
 * GET User 
 */
router.get('/:userIdentifier', 
// isAuthenticatedMiddleware,
  async (req, res) => {
    try {
      let user = await findUserByIdOrEmail(req.params.userIdentifier, true);
      if(!user)
        return res.sendStatus(404);
        
      res.json(user);
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
 * UPDATE User
 */
router.patch('/:userId',
  isAuthenticatedMiddleware,
  async (req, res) => {
    const id = req.params.userId;
    const username = req.body.username;
    const email = req.body.email;
    const isAdmin = req.body.isAdmin;
    const emailVerified = req.body.emailVerified;
    const password = req.body.password;

    try {
      const updatedUser = await updateUser({
        id,
        username,
        email,
        isAdmin,
        password,
        emailVerified,
        password
      }, req.user);
      return res.json(updatedUser);
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