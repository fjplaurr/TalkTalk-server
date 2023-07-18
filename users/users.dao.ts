import shortid from 'shortid';
import MongoDbService from '../common/services/mongodb/mongodb.service';
import { CreateUserDto, PatchUserDto, PutUserDto } from './types/dto';

class UsersDao {
  collectionName;

  constructor() {
    this.collectionName = 'users';
  }

  async readAll() {
    const documents = await MongoDbService.readMany({});
    return documents;
  }

  async readById(id: string) {
    return MongoDbService.readOne({ _id: id });
  }

  async create(userFields: CreateUserDto) {
    const id = shortid.generate();
    MongoDbService.create({
      ...userFields,
      _id: id,
    });
    return id;
  }

  async updateById(id: string, userFields: PatchUserDto | PutUserDto) {
    return MongoDbService.update({ _id: id }, userFields);
  }

  async deleteById(id: string) {
    return MongoDbService.delete({ _id: id });
  }

  async getUserByEmail(email: string) {
    const document = await MongoDbService.readOne({ email });
    return document;
  }

  async readFollowing(id: string) {
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

    const documents = await MongoDbService.aggregate(pipeline);

    return documents && documents.length > 0 ? documents[0].ids : [];
  }
}

const usersDao = new UsersDao();

const usersDaoProxy = new Proxy(usersDao, {
  get(target: typeof usersDao, prop: keyof typeof usersDao) {
    MongoDbService.setCollection(target.collectionName);
    return target[prop];
  },
});

export default usersDaoProxy;
