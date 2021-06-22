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
    id: _id, 
    email,
    username,
    createdAt
  }));
}


/**
 * Finds a User by email or Id
 * @param {string} userIdentifier
 * @param {boolean} restricted Restricts access to save values only
 */
 export async function findUserByIdOrEmail(userIdentifier, restricted) {
  try {
    let userReq;
    if(validator.isEmail(userIdentifier)) {
      userReq = User.findOne({email: userIdentifier});

    } else {
      userReq = User.findOne({_id: userIdentifier})
    }
    
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
 * Finds a User by Id
 * @param {string} email Email of the User
 * @param {boolean} restricted Restricts access to save values only
 */
 export async function findUserById(userId, restricted) {
  try {

    let userReq = User.findOne({_id: userId});
    
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
 * @param {string} password Password of the user
 * @param {User | undefined} reqUser Requesting User
 */
export async function createUser(username, email, password, reqUser) {
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

export async function updateUser(updatedUser, requestingUser) {
  const user = await User.findById(updatedUser.id);

  if(user == undefined)
    throw new Error('User not found');

  // update username
  if(updatedUser.username) {
    if(requestingUser.isAdmin) {
      user.username = updatedUser.username;
    } else {
      throw new Error("User not authorized");
    }
  }

  // update email
  if(updatedUser.email) {
    if(requestingUser.isAdmin) {
      user.email = updatedUser.email;
    } else {
      throw new Error("User not authorized");
    }
  }

  // update password
  if(updatedUser.password) {
    if(updatedUser.id == requestingUser._id || requestingUser.isAdmin) {
      user.password = updatedUser.password;
    } else {
      throw new Error("User not authorized");
    }
  }

  // update emailVerified
  if(updatedUser.emailVerified != undefined) {
    if(requestingUser.isAdmin) {
      user.emailVerified = updatedUser.emailVerified;
    } else {
      throw new Error("User not authorized");
    }
  }

  // update user role
  if(updatedUser.isAdmin != undefined) {
    if(requestingUser.isAdmin) {
      user.isAdmin = updatedUser.isAdmin;
    } else {
      throw new Error("User not authorized");
    }
  }

  let savedUser = await user.save();
  return {
    id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email,
    emailVerified: savedUser.emailVerified,
    isAdmin: savedUser.isAdmin
  };
}