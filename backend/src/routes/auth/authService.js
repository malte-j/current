import { findUserByEmail } from '../users/usersService'
import jwt from 'jsonwebtoken'
import config from '../../config'

export async function createSessionToken(email, password) {

  const user = await findUserByEmail(email);

  if(!user)
    throw new Error("user not found")

  const passwordMatch = user.comparePassword(password);

  if(!passwordMatch)
    throw new error("password incorrect")

  const expirationTime = config.jwt.expiryTime;
  const privateKey = config.jwt.privateKey;

  const token = jwt.sign({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin
  }, privateKey, {expiresIn: expirationTime * 1000, algorithm: 'HS256'});

  return {user, token};
} 

export function isAuthenticated(req, res, next) {
  if(!req.headers.authorization)
    return res.status(401).json({ error: "Not Authorized" });

  try {
    // jwt.verify throws an error if token could not be verified
    let decodedToken = decodeHeader(req.headers.authorization);
    
    req.user = decodedToken;
    return next();

  } catch(e) {
    return res.status(401).json({ error: "Not Authorized" });
  }
}

export function isAdmin(req) {
  if(!req.headers.authorization)
    return res.status(403).json({ error: "Forbidden" });

  try {
    const user = decodeToken(req.headers.authorization);
    return user.isAdmin === true;
  } catch(e) {
    return false;
  }
}

export function decodeHeader(authorizationHeader) {
  let token = authorizationHeader.split(" ")[1];
  var privateKey = config.jwt.privateKey;
  return jwt.verify(token, privateKey, { algorithm: "HS256" });
}