import { v2 as cloudinary } from 'cloudinary';

class CloudinaryService {
  async uploadImage(file: any) {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    return cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: 'TalkTalk',
    });
  }
}

export default new CloudinaryService();
