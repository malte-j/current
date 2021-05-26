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


export function verifyToken(token) {
  const privateKey = config.jwt.privateKey;
  try {
    return jwt.verify(token, privateKey, { algorithm: "HS256" });
  } catch {
    return undefined;
  }
}