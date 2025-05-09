import type { Request, Response } from 'express';
import PostsService from './posts.service';
import type {
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
    const postId = await PostsService.create({
      ...req.body,
      authorId: res.locals.jwt.userId,
    });
    res.status(201).send({ id: postId });
  }

  async updateById(
    req: RequestWithParamsAndBody<PatchPostPayload, { id: string }>,
    res: Response
  ) {
    const { userId } = res.locals.jwt;

    const post = await PostsService.readById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post?.authorId !== userId) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this post' });
    }

    const updatedResult = await PostsService.updateById(
      req.params.id,
      req.body
    );

    if (updatedResult?.matchedCount === 0) {
      return res.status(404).json({ message: 'Post could not be updated' });
    }

    if (updatedResult?.modifiedCount && updatedResult.modifiedCount > 0) {
      return res.status(200).send();
    }

    return res.status(204).send();
  }

  async deleteById(req: RequestWithParams<{ id: string }>, res: Response) {
    const { userId } = res.locals.jwt;

    const post = await PostsService.readById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this post' });
    }
    await PostsService.deleteById(req.params.id);

    return res.status(204).send();
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
