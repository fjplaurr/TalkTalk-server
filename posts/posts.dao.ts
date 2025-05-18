import shortid from 'shortid';
import type { DeleteResult, UpdateResult } from 'mongodb';
import MongoDbService from '../common/services/mongodb/mongodb.service';
import type { CreatePostPayload, PatchPostPayload } from './types/dto';
import type { Post } from './types/posts';

class PostsDao {
  collectionName: string;

  constructor() {
    this.collectionName = 'posts';
  }

  async readAll(): Promise<Post[] | null> {
    const documents = await MongoDbService.readMany<Post>();
    return documents;
  }

  async readById(id: string): Promise<Post | null> {
    const document = await MongoDbService.readOne<Post>({
      _id: id,
    });
    return document;
  }

  async create(postsFields: CreatePostPayload): Promise<string> {
    const id = shortid.generate();
    await MongoDbService.create({
      ...postsFields,
      _id: id,
    });
    return id;
  }

  async updateById(
    id: string,
    postsFields: PatchPostPayload
  ): Promise<UpdateResult | null> {
    const updatedDocument = await MongoDbService.update<Post>(
      { _id: id },
      postsFields
    );
    return updatedDocument;
  }

  async deleteById(id: string): Promise<DeleteResult | null> {
    const deletedResult = await MongoDbService.delete({ _id: id });
    return deletedResult;
  }

  async readPostsByUserId(authorId: string): Promise<Post[] | null> {
    const documents = await MongoDbService.readMany<Post>({ authorId });
    return documents;
  }
}

const postsDao = new PostsDao();

const postsDaoProxy = new Proxy(postsDao, {
  get(target: PostsDao, prop: keyof PostsDao): PostsDao[keyof PostsDao] {
    MongoDbService.setCollection(target.collectionName);
    return target[prop];
  },
});

export default postsDaoProxy;
