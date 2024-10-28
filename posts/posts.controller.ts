import { Request, Response } from 'express';
import PostsService from './posts.service';
import {
  CreatePostPayload,
  PatchPostPayload,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from './types/dto';

class PostsController {
  async readById(req: RequestWithParams<{ id: string }>, res: Response) {
    const post = await PostsService.readById(req.params.id);
    res.status(200).send(post);
  }

  async readAll(req: Request, res: Response) {
    const posts = await PostsService.readAll();
    res.status(200).send(posts);
  }

  async create(req: RequestWithBody<CreatePostPayload>, res: Response) {
    const postId = await PostsService.create(req.body);
    console.log('postId', postId);
    res.status(201).send({ id: postId });
  }

  async updateById(
    req: RequestWithParamsAndBody<PatchPostPayload, { id: string }>,
    res: Response
  ) {
    const updatedResult = await PostsService.updateById(
      req.params.id,
      req.body
    );

    if (updatedResult?.matchedCount === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (updatedResult?.modifiedCount && updatedResult.modifiedCount > 0) {
      return res.status(200).send();
    }

    return res.status(304).send();
  }

  async deleteById(req: RequestWithParams<{ id: string }>, res: Response) {
    await PostsService.deleteById(req.params.id);
    res.status(204).send();
  }

  async readPostsByUserId(
    req: RequestWithParams<{ id: string }>,
    res: Response
  ) {
    const posts = await PostsService.readPostsByUserId(req.params.id);
    res.status(200).send(posts);
  }
}

export default new PostsController();
