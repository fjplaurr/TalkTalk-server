import shortid from 'shortid';
import MongoDbService from '../common/services/mongodb/mongodb.service';
import { CreatePostDto } from './dto/create';
import { PatchPostDto } from './dto/patch';
import { PutPostDto } from './dto/put';

const COLLECTION_NAME = 'posts';

class PostsDao {
  async readAll() {
    MongoDbService.setCollection(COLLECTION_NAME);
    const documents = await MongoDbService.readMany({});
    return documents;
  }

  async readById(id: string) {
    MongoDbService.setCollection(COLLECTION_NAME);
    return MongoDbService.readOne({ _id: id });
  }

  async create(postsFields: CreatePostDto) {
    MongoDbService.setCollection(COLLECTION_NAME);
    const id = shortid.generate();
    MongoDbService.create({
      ...postsFields,
      _id: id,
    });
    return id;
  }

  async updateById(id: string, postsFields: PatchPostDto | PutPostDto) {
    MongoDbService.setCollection(COLLECTION_NAME);
    return MongoDbService.update({ _id: id }, postsFields);
  }

  async deleteById(id: string) {
    MongoDbService.setCollection(COLLECTION_NAME);
    return MongoDbService.delete({ _id: id });
  }

  async readPostsByUserId(authorId: string) {
    const documents = await MongoDbService.readMany({ authorId });
    return documents;
  }
}

export default new PostsDao();
