import express from 'express';
import {  createImage, uploadMiddleware } from './imagesService';
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

export const imagesRouter = router;