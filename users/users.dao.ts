import shortid from 'shortid';
import type { DeleteResult, UpdateResult } from 'mongodb';
import MongoDbService from '../common/services/mongodb/mongodb.service';
import type { CreateUserPayload, PatchUserPayload } from './types/dto';
import type { User } from './types/users';

class UsersDao {
  collectionName;

  constructor() {
    this.collectionName = 'users';
  }

  async readAll(): Promise<User[] | null> {
    const documents = await MongoDbService.readMany<User>({});
    return documents;
  }

  async readById(id: string): Promise<User | null> {
    const document: User | null = await MongoDbService.readOne<User>({
      _id: id,
    });
    return document;
  }

  async create(userFields: CreateUserPayload): Promise<string> {
    const id = shortid.generate();
    const { email, password, firstName, lastName } = userFields;

    const wasCreated = await MongoDbService.create<User>({
      email,
      password,
      firstName,
      lastName,
      _id: id,
      followingUsers: [],
      pictureSrc: '',
      status: '',
    });

    return wasCreated ? id : '';
  }

  async updateById(
    id: string,
    userFields: PatchUserPayload
  ): Promise<UpdateResult | null> {
    const updatedDocument = await MongoDbService.update(
      { _id: id },
      userFields
    );
    return updatedDocument;
  }

  async deleteById(id: string): Promise<DeleteResult | null> {
    const deletedResult = await MongoDbService.delete({ _id: id });
    return deletedResult;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const document: User | null = await MongoDbService.readOne<User>({ email });
    return document;
  }

  async readFollowing(id: string): Promise<string[]> {
    // Aggregation stages
    const $match = { _id: id };
    const $unwind = { path: '$followingUsers' };
    const $project = { id: '$followingUsers' };
    const $group = { _id: null, ids: { $push: '$id' } };
    const projectExcludeIds = { _id: 0 };

    const pipeline = [
      { $match },
      { $unwind },
      { $project },
      { $group },
      { $project: projectExcludeIds },
    ];

    const mongo = await MongoDbService;
    const documents = await mongo.aggregate(pipeline);
    return documents && documents.length > 0 ? documents[0].ids : [];
  }
}

const usersDao = new UsersDao();

const usersDaoProxy = new Proxy(usersDao, {
  get(target: UsersDao, prop: keyof UsersDao): UsersDao[keyof UsersDao] {
    MongoDbService.setCollection(target.collectionName);
    return target[prop];
  },
});

export default usersDaoProxy;
