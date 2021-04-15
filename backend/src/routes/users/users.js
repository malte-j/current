import express from 'express';
import validator from 'express-validator';
const { body, validationResult } = validator;
import { getUsers, createUser } from './usersService'
import { isAuthenticated, isAdmin } from '../auth/authService'

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
      const newUser = usersService.createUser(username, email, unencryptedPassword);
      return res.json(newUser);
    } catch (e) {
      return res.status(400).json({errors:[e]})
    }
  }
);

// UPDATE User
router.patch('/',
  async (req, res) => {

  }
)

// DELETE User
router.delete('/',
  async (req, res) => {
    // @TODO
  }
)


export const usersRouter = router;