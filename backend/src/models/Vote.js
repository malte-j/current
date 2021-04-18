import mongoose from 'mongoose';
const { Schema } = mongoose;

const voteSchema = new Schema({
  _post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;