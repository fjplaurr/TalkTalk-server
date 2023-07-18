import shortid from 'shortid';
import MongoDbService from '../common/services/mongodb/mongodb.service';
import { CreatePostDto, PatchPostDto, PutPostDto } from './types/dto';

class PostsDao {
  collectionName;

  constructor() {
    this.collectionName = 'posts';
  }

  async readAll() {
    const documents = await MongoDbService.readMany({});
    return documents;
  }

  async readById(id: string) {
    return MongoDbService.readOne({ _id: id });
  }

  async create(postsFields: CreatePostDto) {
    const id = shortid.generate();
    MongoDbService.create({
      ...postsFields,
      _id: id,
    });
    return id;
  }

  async updateById(id: string, postsFields: PatchPostDto | PutPostDto) {
    return MongoDbService.update({ _id: id }, postsFields);
  }

  async deleteById(id: string) {
    return MongoDbService.delete({ _id: id });
  }

  async readPostsByUserId(authorId: string) {
    const documents = await MongoDbService.readMany({ authorId });
    return documents;
  }
}

const postsDao = new PostsDao();

const postsDaoProxy = new Proxy(postsDao, {
  get(target: typeof postsDao, prop: keyof typeof postsDao) {
    MongoDbService.setCollection(target.collectionName);
    return target[prop];
  },
});

export default postsDaoProxy;
