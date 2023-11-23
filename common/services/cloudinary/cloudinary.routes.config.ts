import express from 'express';
import CloudinaryController from './cloudinary.controller';

const router = express.Router();

router.post('/upload', CloudinaryController.uploadImage);

export default router;
