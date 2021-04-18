import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  markdownBody: {
    type: String,
    required: true
  },
  _thumbnail: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
}, {timestamps: true})


const Post = mongoose.model('Post', postSchema);
export default Post;