import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  _post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  content: {
    type: String,
    required: true
  },
}, {timestamps: true})

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;