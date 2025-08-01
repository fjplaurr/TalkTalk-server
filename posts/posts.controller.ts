import type { Request, Response } from 'express';
import type { JwtPayload } from '@auth/auth.controller';
import PostsService from './posts.service';
import type {
  CreatePostPayload,
  PatchPostPayload,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from './types/dto';
import type { Post } from './types/posts';

class PostsController {
  async readById(
    req: RequestWithParams<{ id: string }>,
    res: Response
  ): Promise<Response> {
    const post: Post | null = await PostsService.readById(req.params.id);

    if (post === null) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).send(post);
  }

  async readAll(req: Request, res: Response): Promise<Response> {
    const posts: Post[] | null = await PostsService.readAll();

    if (posts === null || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    return res.status(200).send(posts);
  }

  async create(
    req: RequestWithBody<CreatePostPayload>,
    res: Response
  ): Promise<Response> {
    const postId = await PostsService.create({
      ...req.body,
      authorId: res.locals.jwt.userId,
    });
    return res.status(201).send({ id: postId });
  }

  async updateById(
    req: RequestWithParamsAndBody<PatchPostPayload, { id: string }>,
    res: Response
  ): Promise<Response> {
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

  async deleteById(
    req: RequestWithParams<{ id: string }>,
    res: Response
  ): Promise<Response> {
    const { userId } = res.locals.jwt as JwtPayload;

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
  ): Promise<Response> {
    const posts = await PostsService.readPostsByUserId(req.params.id);
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }
    return res.status(200).send(posts);
  }
}

export default new PostsController();
