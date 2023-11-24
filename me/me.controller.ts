/* eslint-disable camelcase */
import { Request, Response } from 'express';
import multer from 'multer';
import CloudinaryService from '../common/services/cloudinary/cloudinary.service';
import { runMiddleware } from '../common/services/cloudinary/middleware/cloudinary.middleware';
import UsersService from '../users/users.service';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single('avatar');

class MeController {
  async updateAvatar(req: Request, res: Response) {
    await runMiddleware(req, res, myUploadMiddleware);

    const { secure_url } = await CloudinaryService.uploadImage(req.file!);

    // update user avatar with the secure_url from Cloudinary
    const modifiedDocuments = await UsersService.updateById(
      res.locals.jwt.userId,
      {
        pictureSrc: secure_url,
      }
    );

    if (modifiedDocuments > 0) {
      res.status(200).send({ pictureSrc: secure_url });
    } else {
      res.status(304).send();
    }
  }

  async updateProfile(req: Request, res: Response) {
    const modifiedDocuments = await UsersService.updateById(
      res.locals.jwt.userId,
      req.body
    );

    if (modifiedDocuments > 0) {
      res.status(200).send({ id: res.locals.jwt.userId });
    } else {
      res.status(304).send();
    }
  }
}

export default new MeController();
