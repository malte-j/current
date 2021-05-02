import express from 'express';
import {  createImage, getImageInfo, getImagesInfo } from './imagesService';
import { isAuthenticated } from '../auth/authService'
import multer from 'multer';
import mongoose from 'mongoose';

let upload = multer({
  limits: {
    // @TODO: should be 5MB, try out!
    fileSize: 5 * 1024 * 1024
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.cwd() + '/public/img')
    },
    filename: (req, file, cb) => {
      const name = new mongoose.Types.ObjectId();
      const ext = file.mimetype.split('/')[1];
      file.originalname = name;
      cb(null, `${name}.${ext}`)
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

const router = express.Router();

router.post('/', 
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    try {
      const newImage = await createImage(req.file, req.user);
      res.json(newImage);
    } catch(e) {
      console.log(e)
      return res.status(400).json({error: e})
    }
  }
)

router.get('/:imageId',
  (req, res, next) => {
    if(!req.is('application/json'))
      return express.static(path.join(path.resolve(), '/public/img'))
    else
      next()
  },
  async (req, res) => {
    const imageId = req.query.imageId;
    try {
      let images;

      if(imageId) {
        images = await getImageInfo(imageId);
      } else {
        images = await getImagesInfo();
      }

      return res.json(images)
    } catch(e) {
      return res.error(400).json({
        error: e
      })
    }
  }
)

export const imagesRouter = router;