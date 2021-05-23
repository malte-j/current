import Followers from '../../models/Followers';

/**
 * Follow annother user
 * @param {string} user ID of the user to follow
 * @param {string} follower The user who is following
 * @param {User} requestingUser ID of the user to follow 
 */
export async function followUser(user, follower) {
  let newFollow = new Followers({
    _from: user,
    _to: follower
  });

  return newFollow.save();
}


/**
 * Get all followers for this user
 * @param {string} user Get followers for this user
 */
export async function getFollowers(user) {
   const populatedFollowers = await Followers.find({
    _to: user
  })
  .select('_from')
  .populate('_from', "_id username")
  .exec()

  return populatedFollowers.map(edge => edge._from)
}


/**
 * Get all people who the user is following
 * @param {string} user Get followers for this user
 */
export async function getFollowing(user) {
  const populatedFollowers = await Followers.find({
    _from: user
  })
  .select('_to')
  .populate('_to', "_id username")
  .exec()

  return populatedFollowers.map(edge => edge._to)
}


/**
 * Stop following someone
 * @param {string} userToUnfollow The user who you are currently following 
 * @param {*} user The user requesting to stop following someone
 */
export async function unfollow(userToUnfollow, user) {
  return Followers.deleteOne({
    _from: user,
    _to: userToUnfollow
  })
}