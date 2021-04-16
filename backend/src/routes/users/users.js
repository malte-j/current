import express from 'express';
import validator from 'express-validator';
const { body, validationResult } = validator;
import { getUsers, createUser } from './usersService'
import { isAuthenticated, isAdmin, verifyUserEmail } from '../auth/authService'

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
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
      return res.status(400).json({ errors: errors.array() });

    const email = req.body.email;
    const username = req.body.username;
    const unencryptedPassword = req.body.password;

    try {
      const newUser = await createUser(username, email, unencryptedPassword);
      return res.json({
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        emailVerified: newUser.emailVerified
      });
    } catch (e) {
      return res.status(400).json(e)
    }
  }
);

// UPDATE User
router.patch('/',
  async (req, res) => {
   // @TODO

  }
)

// DELETE User
router.delete('/',
  async (req, res) => {
    // @TODO
  }
)

router.patch('/',
  body('emailVerificationToken').length(20),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
      return res.status(400).json({ errors: errors.array() });

    verifyUserEmail(req.body.emailVerificationToken);
    // @TODO: Verify that this is working!!!
  }
)


export const usersRouter = router;