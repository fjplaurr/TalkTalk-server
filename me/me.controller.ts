/* eslint-disable camelcase */
import { Request, Response } from 'express';
import multer from 'multer';
import CloudinaryService from '../common/services/cloudinary/cloudinary.service';
import { runCallbackMiddlewareAsPromise } from '../common/services/cloudinary/middleware/cloudinary.middleware';
import UsersService from '../users/users.service';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single('avatar');

class MeController {
  async updateAvatar(req: Request, res: Response) {
    try {
      // run Multer middleware to process file upload
      await runCallbackMiddlewareAsPromise(req, res, myUploadMiddleware);

      // upload image to Cloudinary
      const { secure_url } = await CloudinaryService.uploadImage(req.file!);

      // update user avatar in Mongodb with the secure_url from Cloudinary
      const updatedResult = await UsersService.updateById(
        res.locals.jwt.userId,
        { pictureSrc: secure_url }
      );

      if (!updatedResult) {
        return res.status(500).json({ message: 'Error updating the user' });
      }

      if (updatedResult.matchedCount === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }

      return updatedResult.modifiedCount > 0
        ? res.status(200).send({ pictureSrc: secure_url })
        : res.status(304).send();
    } catch (err) {
      console.error('Error uploading image:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    const updatedResult = await UsersService.updateById(
      res.locals.jwt.userId,
      req.body
    );

    if (updatedResult?.matchedCount === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (updatedResult?.modifiedCount && updatedResult.modifiedCount > 0) {
      return res.status(200).send({ id: res.locals.jwt.userId });
    }

    return res.status(304).send();
  }
}

export default new MeController();
