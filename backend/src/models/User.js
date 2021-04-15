import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  email: {
    type:String,
    unique:true,
    index: true,
    uniqueCaseInsensitive: true,
    uniqueCaseInsensitive: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

userSchema.pre('save', function (next) {
  let user = this;
  
  if (!user.isModified('password'))
    return next();

  bcrypt.hash(user.password,10).then((hashedPassword) => {
    user.password = hashedPassword;
    next();
  })
  }, function (err) {
  next(err)
  }
)


// save email as lowercase
userSchema.pre('save',
  function (next) {
    let user = this;
    
    if (!user.isModified('email'))
      return next();

    user.email = user.email.toLowerCase();
    next();
  }, function (err) {
    next(err)
  }
)

userSchema.methods.comparePassword = async function(candidatePassword){
  const match = await bcrypt.compare(candidatePassword,this.password)
  
  return match;
}

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

export default User