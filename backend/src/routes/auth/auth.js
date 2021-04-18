import express from 'express';
import { createSessionToken } from './authService';

const router = express.Router();

/**
 * Login
 */
router.post('/', 
  async (req, res) => {
    // try extracting username and password from header
    let username, password; 
    try {
      let b64LoginData =  req.headers.authorization.split(' ')[1];
      const credentials = Buffer.from(b64LoginData, 'base64').toString('ascii');
      [username, password] = credentials.split(/:(.+)/);
    } catch(e) {
      return res.status(403).send("Wrong format of authorization header");
    }
  
    // try logging user in and creating token
    let token, user;
    try {
      ({ token, user } = await createSessionToken(username, password));
    } catch(e) {
      if(e) {
        return res.status(403).send("authentication failed")
      }
    }

    if(!token)
      return res.status(403).send("authentication failed")

    res.header("Authorization", "Bearer " + token)

    res.json({
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin
    })
  }
);


/**
 * Logout
 */
router.delete('/',
  async (req, res) => {
    return res.status(501).send();
  }
)


export const authRouter = router; 