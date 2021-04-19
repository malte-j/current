import mongoose from 'mongoose';
const { Schema } = mongoose;

const imageSchema = new Schema({
  _uploader: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  url: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  format: {
    type: String,
    required: true
  }
}, {timestamps: true})

const Image = mongoose.model('Image', imageSchema);
export default Image;