import sharp from 'sharp';
import multer from 'multer';
import mongoose from 'mongoose';
import Image from '../../models/Image';
import config from '../../config';


/**
 * Multer middleware for file upload
 */
export const uploadMiddleware = multer({
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
    console.log(file)

      cb(null, process.cwd() + '/public/img')
    },
    filename: (req, file, cb) => {
    console.log(file)

      const name = new mongoose.Types.ObjectId();
      const ext = file.mimetype.split('/')[1];
      file.originalname = name;
      cb(null, `${name}`)
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

// export async function getImage(requestedFile, width, height) {
//   if(!width && !height)
//     throw new Error('Either height or width must be specified')

//   const requestedFileRegex = /^([A-Za-z0-9_-]{24})(\.)(png|jpg|webp|jpg|avif)$/i;
//   const filteredRequestedFile = requestedFileRegex.exec(requestedFile);

//   if(!filteredRequestedFile) 
//     throw new Error('Requested file format is incorrect');
  
//   const id      = filteredFileReq[1];
//   const format  = filteredFileReq[3];

//   const filename = `${id}_${width}x${height}.${format}`;

//   const sendFileOptions = {
//     maxAge: '1y',
//     root: path.join(process.cwd(), 'public/img'),
//     lastModified: false,
//     dotfiles: 'deny',
//   }
// }


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

export async function getImageInfo(id) {
  return Image.findOne(id);
}

export async function getImagesInfo() {
  return Image.find();
}