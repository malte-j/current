import express from 'express';
import { getUsers, createUser, verifyUserEmail, changePassword } from './usersService'
import { isAuthenticated, isAdmin, createSessionToken } from '../auth/authService'
import debug from '../../services/debug';

const router = express.Router();

/* GET users listing. */
router.get('/', 
  isAuthenticated,
  async (req, res, next) => {
    let users = await getUsers();
    res.send("users");
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
        _íd: newUser._id,
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

// Update User
//   Change Password
router.patch('/:userId',
  isAuthenticated,
  async (req, res) => {
    const newPassword = req.body.password

    try {
      await changePassword(req.user._id, newPassword);
      return res.json({status: "success"})
    } catch(e) {
      return res.status(400).json({ error: e.message })
    }
    
  }
)

// DELETE User
router.delete('/',
  async (req, res) => {
    // @TODO
  }
)

// Verify Email
router.patch('/',
  async (req, res) => {
    try {
      const verifiedUser = await verifyUserEmail(req.body.emailVerificationToken);
      debug("user successfully verified: " + verifiedUser.username)

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