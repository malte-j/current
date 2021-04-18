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

const Followers = mongoose.model('Followers', followersSchema);
export default Followers;