import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response } from 'express';
import UsersService from '../../../users/users.service';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single('avatar');

function runMiddleware(req: Request, res: Response, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

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
    async function handleUpload(file: string) {
      const uploadResponse = await cloudinary.uploader.upload(file, {
        resource_type: 'auto',
        folder: 'TalkTalk',
      });
      return uploadResponse;
    }

    try {
      await runMiddleware(req, res, myUploadMiddleware);
      const b64 = Buffer.from(req.file!.buffer).toString('base64');
      const dataURI = `data:${req.file!.mimetype};base64,${b64}`;
      const cldRes = await handleUpload(dataURI);
      await UsersService.updateById(req.body.userId, {
        pictureSrc: cldRes.secure_url,
      });
      return res.json({ url: cldRes.secure_url });
    } catch (err) {
      console.log(`It was not possible to upload the image:`, err);
      return res.sendStatus(500);
    }
  }
}

export default new CloudinaryController();
