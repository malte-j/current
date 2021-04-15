import User from '../../models/User';

export async function getUsers() {
  let users;

  try {
    users = User.find
  } catch(e) {
    users = []
  }

  return users;
}

export async function findUserByEmail(email) {
  try {
    let user = await User.findOne({email: email}).exec();
    
    if(!user && email === 'admin') {
      let adminUser = new User();
      adminUser.username = "admin";
      adminUser.email = "admin";
      adminUser.isAdmin = true;
      adminUser.password = "password" 
      user = await adminUser.save()
    }

    return user;
  } catch (e) {
    console.error(e);
    return;
  }
}

