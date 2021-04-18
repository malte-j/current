import mongoose from 'mongoose';
const { Schema } = mongoose;

const imageSchema = new Schema({
  _uploader: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  url: {
    type: String,
  },
  name: {
    type: String,
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  format: {
    type: String
  }
}, {timestamps: true})

const Image = mongoose.model('Image', imageSchema);
export default Image;