import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    dropDups: true,
    required: true,
  },
  email: {
    type:String,
    unique:true,
    index: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
  },
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

userSchema.methods.comparePassword = async function(candidatePassword){
  const match = await bcrypt.compare(candidatePassword,this.passwordHash)
  
  return match;
}

const User = mongoose.model('User', userSchema);

export default User