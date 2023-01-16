import * as shortid from 'shortid';
import MongoService from '../common/services/mongodb.service';
import { CreatePostDto } from './dto/create';
import { PatchPostDto } from './dto/patch';
import { PutPostDto } from './dto/put';

class PostsDao {
  constructor() {
    MongoService.setCollection('posts');
  }

  async readAll() {
    const documents = await MongoService.readMany({});
    return documents;
  }

  async readById(id: string) {
    return MongoService.readOne({ _id: id });
  }

  async create(postsFields: CreatePostDto) {
    const id = shortid.generate();
    MongoService.create({
      ...postsFields,
      _id: id,
    });
    return id;
  }

  async updateById(id: string, postsFields: PatchPostDto | PutPostDto) {
    return MongoService.update({ _id: id }, postsFields);
  }

  async deleteById(id: string) {
    return MongoService.delete({ _id: id });
  }
}

export default new PostsDao();
