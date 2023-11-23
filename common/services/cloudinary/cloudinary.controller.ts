import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response } from 'express';
import CloudinaryService from './cloudinary.service';
import { runMiddleware } from './middleware/cloudinary.middleware';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single('avatar');

class CloudinaryController {
  config;

  constructor() {
    this.config = cloudinary.config({
      cloud_name: 'fjplaurr',
      api_key: '179697748468174',
      api_secret: 'ZvqRGr9JznYqIf2390k_4tc1fp8',
      secure: true,
    });
  }

  async uploadImage(req: Request, res: Response) {
    try {
      await runMiddleware(req, res, myUploadMiddleware);
      const cldRes = await CloudinaryService.uploadImage(req.file!);
      return res.status(201).send({ cldRes });
    } catch (err) {
      console.log(`It was not possible to upload the image:`, err);
      return res.sendStatus(500);
    }
  }
}

export default new CloudinaryController();
