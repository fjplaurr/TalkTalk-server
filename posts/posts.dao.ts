import shortid from 'shortid';
import MongoDbService from '../common/services/mongodb/mongodb.service';
import type { CreatePostPayload, PatchPostPayload } from './types/dto';
import type { Post } from './types/posts';

class PostsDao {
  collectionName;

  constructor() {
    this.collectionName = 'posts';
  }

  async readAll() {
    const documents = await MongoDbService.readMany<Post>();
    return documents;
  }

  async readById(id: string) {
    const document = await MongoDbService.readOne<Post>({
      _id: id,
    });
    return document;
  }

  async create(postsFields: CreatePostPayload) {
    const id = shortid.generate();
    await MongoDbService.create({
      ...postsFields,
      _id: id,
    });
    return id;
  }

  async updateById(id: string, postsFields: PatchPostPayload) {
    const updatedDocument = await MongoDbService.update(
      { _id: id },
      postsFields
    );
    return updatedDocument;
  }

  async deleteById(id: string) {
    const deletedResult = await MongoDbService.delete({ _id: id });
    return deletedResult;
  }

  async readPostsByUserId(authorId: string) {
    const documents = await MongoDbService.readMany({ authorId });
    return documents;
  }
}

const postsDao = new PostsDao();

const postsDaoProxy = new Proxy(postsDao, {
  get(target: PostsDao, prop: keyof PostsDao) {
    MongoDbService.setCollection(target.collectionName);
    return target[prop];
  },
});

export default postsDaoProxy;
