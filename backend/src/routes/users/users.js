import express from 'express';
import { getUsers, createUser, verifyUserEmail, changePassword, deleteUser } from './usersService'
import { isAuthenticated, isAdmin, createSessionToken } from '../auth/authService'
import debug from 'debug';
const log = debug('route:users');

const router = express.Router();

/* GET users listing. */
router.get('/', 
  isAuthenticated,
  async (req, res, next) => {
    try {
      let users = await getUsers();
      res.send(users);
    } catch(e) {
      res.status(400).send({error: e})
    }
  }
);

// CREATE User
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

// UPDATE User
//   Change Password
router.patch('/:userId',
  isAuthenticated,
  async (req, res) => {
    if(req.params.userId !== req.user._id && !isAdmin(req))
      return res.status(403).send({error: "not authorized"})

    const newPassword = req.body.password;

    try {
      await changePassword(req.params.userId, newPassword);
      return res.json({status: "success"});
    } catch(e) {
      return res.status(400).json({ error: e.message });
    }
  }
)

// DELETE User
router.delete('/:userId',
  isAuthenticated,
  async (req, res) => {
    if(req.params.userId !== req.user._id && !isAdmin(req))
      return res.status(403).send({error: "not authorized"})

    try {
      deleteUser(req.user._id);
      return res.json({status: "success"})
    } catch(e) {
      return res.status(400).json({error: e});
    }
  }
)

// Verify Email
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