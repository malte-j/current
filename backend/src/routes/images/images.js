import express from 'express';
import { uploadMiddleware, createImage } from './imagesService';
import { isAuthenticated } from '../auth/auth'
import mongoose from 'mongoose';

const router = express.Router();


router.post('/', 
  isAuthenticated,
  uploadMiddleware.single("image"),
  async (req, res) => {
    try {
      const newImage = await createImage(req.file);
      res.json(newImage);

    } catch(e) {
      return res.status(400).json({error: e})
    }
  }
)

export const imagesRouter = router;