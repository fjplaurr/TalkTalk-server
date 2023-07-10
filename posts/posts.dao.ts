import shortid from 'shortid';
import MongoService from '../common/services/mongodb/mongodb.service';
import { CreatePostDto } from './dto/create';
import { PatchPostDto } from './dto/patch';
import { PutPostDto } from './dto/put';

const COLLECTION_NAME = 'posts';

class PostsDao {
  async readAll() {
    MongoService.setCollection(COLLECTION_NAME);
    const documents = await MongoService.readMany({});
    return documents;
  }

  async readById(id: string) {
    MongoService.setCollection(COLLECTION_NAME);
    return MongoService.readOne({ _id: id });
  }

  async create(postsFields: CreatePostDto) {
    MongoService.setCollection(COLLECTION_NAME);
    const id = shortid.generate();
    MongoService.create({
      ...postsFields,
      _id: id,
    });
    return id;
  }

  async updateById(id: string, postsFields: PatchPostDto | PutPostDto) {
    MongoService.setCollection(COLLECTION_NAME);
    return MongoService.update({ _id: id }, postsFields);
  }

  async deleteById(id: string) {
    MongoService.setCollection(COLLECTION_NAME);
    return MongoService.delete({ _id: id });
  }

  async readPostsByUserId(authorId: string) {
    const documents = await MongoService.readMany({ authorId });
    return documents;
  }
}

export default new PostsDao();
