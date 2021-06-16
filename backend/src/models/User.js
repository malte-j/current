import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import validator from 'validator';


import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
    validate: {
      validator: validateUsername,
      message: props => `${props.value} hat nicht das passende Format für Nutzernamen.`
    },
  },
  email: {
    type:String,
    unique:true,
    index: true,
    validator: validateEmail,
    uniqueCaseInsensitive: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: password => password.length >= 8,
      message: "has to be at least 8 characters long"
    }
  },
  _profilePicture: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    index: true,
    default: () => {
      const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomString = '';
      for (var i = 0; i < 20; i++) {
        var randomPos = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPos,randomPos+1);
      }
      return randomString;
    }
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


userSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});

const User = mongoose.model('User', userSchema);

export default User

export function validateUsername(username) {
  return(/^[a-zA-Z0-9]+([a-zA-Z0-9\-_]){2,14}$/.test(username))
}

export function validateEmail(email) {
  return validator.isEmail(email)
}