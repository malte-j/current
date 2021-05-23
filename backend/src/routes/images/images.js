import express from 'express';
import {  createImage, getImageInfo, getImagesInfo, uploadMiddleware } from './imagesService';
import { isAuthenticated } from '../auth/authService'
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import debug from 'debug';
const log = debug('route:images')


const router = express.Router();
export const imagesRouter = router;

router.post('/', 
  isAuthenticated,
  uploadMiddleware,
  async (req, res) => {
    try {
      const newImage = await createImage(req.file, req.user);
      res.json(newImage);
    } catch(e) {
      log(e)
      return res.status(400).json({error: e.message})
    }
  }
)

/**
 * Get a single image
 */
router.get('/:image',
  (req, res) => {
    const requestedFileRegex = /^([A-Za-z0-9_-]{24})(\.)(png|jpg|webp|avif)$/i;
    const filteredFileReq = requestedFileRegex.exec(req.params.image);
    log('request for image: ' + req.params.image);

    // check if file request is in correct format
    if(!filteredFileReq) 
      return res.sendStatus(400);
    
    // get file metadata
    const id      = filteredFileReq[1];
    const format  = filteredFileReq[3];
    let width   = parseInt(req.query.width);
    let height  = parseInt(req.query.height);

    // check if width and height have correct format
    if(!width || !height)
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

        // set content and caching headers
        res.set('Content-Type', `image/${format === 'jpg'? 'jpeg' : format}`);        
        res.set('Cache-Control', 'public, max-age=31536000');

        const outputPath = path.join(process.cwd(), 'public/img', filename);

        // catch error, should be mostly 404
        sharpOutput.on('error', e => {
          log(e);
          // delete temporary file
          fs.unlinkSync(outputPath);
          return res.sendStatus(404);
        });

        // stream output to user
        sharpOutput.pipe(res)

        // stream output to file
        let fileOutStream = fs.createWriteStream(outputPath)
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

