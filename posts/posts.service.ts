import type { UpdateResult, DeleteResult } from 'mongodb';
import PostsDao from './posts.dao';
import type { CreatePostPayload, PatchPostPayload } from './types/dto';
import type { Post } from './types/posts';

class PostsService {
  async readAll(): Promise<Post[] | null> {
    return PostsDao.readAll();
  }

  async readById(id: string): Promise<Post | null> {
    return PostsDao.readById(id);
  }

  async create(resource: CreatePostPayload): Promise<string> {
    return PostsDao.create(resource);
  }

  async updateById(
    id: string,
    resource: PatchPostPayload
  ): Promise<UpdateResult | null> {
    return PostsDao.updateById(id, resource);
  }

  async deleteById(id: string): Promise<DeleteResult | null> {
    return PostsDao.deleteById(id);
  }

  async readPostsByUserId(authorId: string): Promise<Post[] | null> {
    return PostsDao.readPostsByUserId(authorId);
  }
}

export default new PostsService();
