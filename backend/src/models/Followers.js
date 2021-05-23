import mongoose from 'mongoose';
const { Schema } = mongoose;

const followersSchema = new Schema({
  _from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  _to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
})


followersSchema.index({_from: 1, _to:1}, {unique: true})

const Followers = mongoose.model('Followers', followersSchema);

export default Followers;