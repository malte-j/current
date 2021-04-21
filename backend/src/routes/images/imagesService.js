import sharp from 'sharp';
import multer from 'multer';
import Image from '../../models/Image'
import config from '../../config';

export function uploadMiddleware() {
  return multer({
    limits: {
      // @TODO: should be 5MB, try out!
      fileSize: 5 * 1024 * 1024
    },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, '/public/img')
      },
      filename: (req, file, cb) => {
        const name = new mongoose.Types.ObjectId();
        const ext = file.mimetype.split('/')[1];
        file.originalname = name;
        cb(null, `${name}${ext}`)
      }
    }),
    filter: (req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(new Error('Not an image! Please upload an image.'), false);
      }
    }
  })
}

export async function createImage(image, user) {
  if(!image)
    throw new Error("No image provided");

  let imageDbEntry = new Image({
    _id: new mongoose.Types.ObjectId(image.originalname),
    _user: new mongoose.Types.ObjectId(user._id),
    format: file.mimetype.split('/')[1]
  });

  imageDbEntry.save();

  return {
    id: imageDbEntry._id,
    url: config.backendUrl + '/img/' + image.filename
  }
}