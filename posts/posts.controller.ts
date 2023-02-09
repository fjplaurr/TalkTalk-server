import { Request, Response } from 'express';
import argon2 from 'argon2';
import PostsService from './posts.service';

class PostsController {
  async readById(req: Request, res: Response) {
    const post = await PostsService.readById(req.params.id);
    res.status(200).send(post);
  }

  async readAll(req: Request, res: Response) {
    const posts = await PostsService.readAll();
    res.status(200).send(posts);
  }

  async create(req: Request, res: Response) {
    const postId = await PostsService.create(req.body);
    res.status(201).send({ id: postId });
  }

  async updateById(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    await PostsService.updateById(req.params.id, req.body);
    res.status(204).send();
  }

  async deleteById(req: Request, res: Response) {
    await PostsService.deleteById(req.params.id);
    res.status(204).send();
  }
}

export default new PostsController();
