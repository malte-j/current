import User from '../../models/User';
import config from '../../config'
import { sendEmailVerification } from '../../services/sendMail';
import validator from 'validator';
import debug from 'debug';
const log = debug('service:users');

/**
 * Get all Users
 */
export async function getUsers() {
  let users = await User.find();
  return users.map(({isAdmin, emailVerified, _id, email, username, createdAt}) => ({
    isAdmin,
    emailVerified,
    _id, 
    email,
    username,
    createdAt
  }));
}


/**
 * Finds a User by email
 * @param {string} email Email of the User
 * @param {boolean} restricted Restricts access to save values only
 */
export async function findUserByEmail(email, restricted) {
  try {

    let userReq = User.findOne({email: email});
    
    if(restricted)
      userReq = userReq.select("isAdmin _id username email createdAt")

    let user = await userReq.exec();

    if(!user && email === config.admin.email) {
      let adminUser = new User();
      adminUser.username = config.admin.username;
      adminUser.email = config.admin.email;
      adminUser.isAdmin = true;
      adminUser.password = config.admin.password; 
      user = await adminUser.save();
    }

    return user;
  } catch (e) {
    console.error(e);
    return;
  }
}


/**
 * Creates a new User
 * @param {string} username Username of the user, must be unique
 * @param {string} email Email of the user, must be unique
 * @param {stringq} password Password of the user
 */
export async function createUser(username, email, password) {
  let newUser = new User();
  newUser.email = email;
  newUser.username = username;
  newUser.password = password;
  const createdUser = await newUser.save();
  sendEmailVerification(createdUser);
  return createdUser;
}

/**
 * Delete a user
 * @param {string} _id ID of the user to delete
 * @param {string} user Object containing the requesting user
 */
export async function deleteUser(id, user) {
  if(id !== user._id && !user.isAdmin) {
    log('User is not authorized');
    return new Error('Not authorized');
  }

  return User.deleteOne({
      _id: id
  }).exec();
}

/**
 * Verify a users Email
 * @param {string} emailVerificationToken Token send in the verification email
 */
export async function verifyUserEmail(emailVerificationToken) {
  const user = await User.findOne({
    emailVerificationToken: emailVerificationToken
  });

  if(!user)
    throw new Error('verification token not recognized');

  if(user.emailVerified)
    throw new Error('Email already verified');

  user.emailVerified = true;
  user.emailVerificationToken = undefined;

  return await user.save();
}


/**
 * Change the password of a user
 * @param {string} userId ID of the user to change password
 * @param {string} newPassword The new password
 * @param {Object} user Object containing the requesting user
 */
export async function changePassword(userId, newPassword, user) {
  if(!userId || !newPassword)
    throw new Error('Missing userId or Password');

  if(userId !== user._id && !user.isAdmin) {
    log('User is not authorized');
    return new Error('Not authorized');
  }  

  return User.findOneAndUpdate(
    {
      _id: userId
    },
    {
      password: newPassword
    },
    {
      runValidators: true,
      context: 'query'
    }
  );
}