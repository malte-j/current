import mongoose from 'mongoose';
const { Schema } = mongoose;

const imageSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  url: {
    type: String
  },
  format: {
    type: String,
    required: true
  },
  lqip: String
}, {timestamps: true})

const Image = mongoose.model('Image', imageSchema);
export default Image;