import express from 'express';
import { getUsers } from './usersService'
import { isAuthenticated } from '../auth/authService'

const router = express.Router();

/* GET users listing. */
router.get('/', 
  isAuthenticated,
  async (req, res, next) => {
    let users = await getUsers();
    res.send("users");
  }
);

router.post('/', 

  async (req, res, next) => {
    let nwadwad = req;

    let users = await usersService.getUsers();
    res.send(users);
  }
);


export const usersRouter = router;