import PostsDao from './posts.dao';
import { CreatePostPayload, PatchPostPayload } from './types/dto';

class PostsService {
  async readAll() {
    return PostsDao.readAll();
  }

  async readById(id: string) {
    return PostsDao.readById(id);
  }

  async create(resource: CreatePostPayload) {
    return PostsDao.create(resource);
  }

  async updateById(id: string, resource: PatchPostPayload) {
    return PostsDao.updateById(id, resource);
  }

  async deleteById(id: string) {
    return PostsDao.deleteById(id);
  }

  async readPostsByUserId(authorId: string) {
    return PostsDao.readPostsByUserId(authorId);
  }
}

export default new PostsService();
