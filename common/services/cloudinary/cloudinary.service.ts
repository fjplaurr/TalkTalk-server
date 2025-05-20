import type { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import type { Express } from 'express';

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;

class CloudinaryService {
  config;

  constructor() {
    this.config = cloudinary.config({
      cloud_name: 'fjplaurr',
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    return cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: 'TalkTalk',
    });
  }
}

export default new CloudinaryService();
