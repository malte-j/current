import sharp from 'sharp';
import multer from 'multer';
import mongoose from 'mongoose';
import Image from '../../models/Image';
import config from '../../config';
// import fs from 'fs/promises'



export async function getImageInfo(id) {
  return Image.findOne(id);
}


export async function getImagesInfo() {
  return Image.find();
}

export function uploadMiddleware() {
  return multer({
    limits: {
      // @TODO: should be 5MB, try out!
      fileSize: 5 * 1024 * 1024
    },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
      console.log(file)

        cb(null, process.dir() + '/public/img')
      },
      filename: (req, file, cb) => {
      console.log(file)

        const name = new mongoose.Types.ObjectId();
        const ext = file.mimetype.split('/')[1];
        file.originalname = name;
        cb(null, `${name}${ext}`)
      }
    }),
    filter: (req, file, cb) => {
      console.log(file)
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(new Error('Not an image! Please upload an image.'), false);
      }
    }
  }).single('image')
}

export async function createImage(image, user) {
  if(!image)
    throw new Error("No image provided");

  const lqipData = await sharp(image.path)
    .resize(20, 20, {
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .toBuffer()

  let imageDbEntry = new Image({
    _id: new mongoose.Types.ObjectId(image.originalname),
    _user: new mongoose.Types.ObjectId(user._id),
    format: image.mimetype.split('/')[1],
    lqip: `data:image/png;base64,${lqipData.toString('base64')}`
  });

  imageDbEntry.save();

  console.log(imageDbEntry)
  
  return {
    id: imageDbEntry._id,
    url: config.backendUrl + '/img/' + image.filename,
    lqip: imageDbEntry.lqip
  }
}