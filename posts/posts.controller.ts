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
    res.status(201).send({ id: postId });
  }

  async updateById(
    req: RequestWithParamsAndBody<PatchPostPayload, { id: string }>,
    res: Response
  ) {
    const modifiedDocuments = await PostsService.updateById(
      req.params.id,
      req.body
    );

    if (modifiedDocuments > 0) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
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
