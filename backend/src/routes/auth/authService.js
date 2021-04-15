import { findUserByEmail } from '../users/usersService'
import jwt from 'jsonwebtoken'

export async function createSessionToken(email, password) {

  const user = await findUserByEmail(email);

  if(!user)
    throw new Error("user not found")

  const passwordMatch = user.comparePassword(password);

  if(!passwordMatch)
    throw new error("password incorrect")

  const expirationTime = process.env.JWT_EXPIRY_TIME;
  const privateKey = process.env.JWT_PRIVATE_KEY;

  const token = jwt.sign({
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin
  }, privateKey, {expiresIn: expirationTime * 1000, algorithm: 'HS256'});

  return {user, token};
} 

export function isAuthenticated(req, res, next) {
  if(!req.headers.authorization)
    return res.status(403).json({ error: "Not Authorized" });

  try {
    // jwt.verify throws an error if token could not be verified
    let decodedToken = decodeHeader(req.headers.authorization);
    
    req.user = decodedToken;
    return next();

  } catch(e) {
    return res.status(403).json({ error: "Not Authorized" });
  }
}

export function isAdmin(req) {
  if(!req.headers.authorization)
    return res.status(403).json({ error: "Not Authorized" });

  try {
    const user = decodeToken(req.headers.authorization);

  } catch(e) {

  }
}

export function decodeHeader(authorizationHeader) {
  let token = authorizationHeader.split(" ")[1];
  var privateKey = process.env.JWT_PRIVATE_KEY;
  return jwt.verify(token, privateKey, { algorithm: "HS256" });
}