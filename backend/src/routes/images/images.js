import express from 'express';
import {  createImage, getImageInfo, getImagesInfo } from './imagesService';
import { isAuthenticated } from '../auth/authService'
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import mongoose from 'mongoose';
import sharp from 'sharp';
import debug from 'debug';
const log = debug('route:images')

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
      // let ext = file.mimetype.split('/')[1];
      // ext = ext === 'jpeg' ? 'jpg' : ext;
      file.originalname = name;
      cb(null, `${name}`)
    }
  }),
  filter: (req, file, cb) => {
    console.log(file.mimetype)
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
      return res.status(400).json({error: e.message})
    }
  }
)

/**
 * Get a single image
 */
router.get('/:image',
  // if user tries to access a file
  (req, res) => {
    const requestedFileRegex = /^([A-Za-z0-9_-]{24})(\.)(png|jpg|webp|jpg|avif)$/i;
    const filteredFileReq = requestedFileRegex.exec(req.params.image);
    log('request for image: ' + req.params.image);

    // check if file request is in correct format
    if(!filteredFileReq) 
      return res.sendStatus(400);
    
    // get file metadata
    const id      = filteredFileReq[1];
    const format  = filteredFileReq[3];
    let width   = req.query.width;
    let height  = req.query.height;

    // check if width has correct format
    width = parseInt(width);
    if(!width)
      return res.sendStatus(400);

    // check if height has correct format
    height = parseInt(height);
    if(!height)
      return res.sendStatus(400);


    const filename = `${id}_${width}x${height}.${format}`;
    const sendFileOptions = {
      maxAge: '1y',
      root: path.join(process.cwd(), 'public/img'),
      lastModified: false,
      dotfiles: 'deny',
    }

    // try sending cached image
    res.sendFile(filename, sendFileOptions, (err) => {
      // if sending didn't succeed, try generating image
      if(err) {
        log('image not found, generating...')
        // try generating resized image
        const sharpOutput = sharp(path.join(process.cwd(), 'public/img/', id))
          .resize(width, height)
          .toFormat(format)

        // pipe output to response
        sharpOutput.pipe(res)

        // pipe output to file
        let fileOutStream = fs.createWriteStream(path.join(process.cwd(), 'public/img', filename))
        sharpOutput.pipe(fileOutStream);
      } else {
        log('successfully sent image')
      }
    });
  }
)


/**
 * Get a list of images
 */
router.get('/',
  async (req, res) => {
    try {
      const images = await getImagesInfo();
      return res.json(images)
    } catch(e) {
      return sendError(req, 400, e.message)
    }
  }
)


export const imagesRouter = router;