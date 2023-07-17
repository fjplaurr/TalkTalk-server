import shortid from 'shortid';
import MongoDbService from '../common/services/mongodb/mongodb.service';
import { CreateUserDto } from './dto/create';
import { PatchUserDto } from './dto/patch';
import { PutUserDto } from './dto/put';

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
    const matchUserId = { _id: id };
    const lookupFollowingUsers = {
      from: 'users',
      localField: 'following',
      foreignField: '_id',
      as: 'following_users',
    };
    const unwindFollowingUsers = { path: '$following_users' };
    const projectRename = { user: '$following_users' };
    const projectExclude = { _id: 0, 'user.password': 0 };
    const pipeline = [
      { $match: matchUserId },
      { $lookup: lookupFollowingUsers },
      { $unwind: unwindFollowingUsers },
      { $project: projectRename },
      { $project: projectExclude },
    ];

    const documents = await MongoDbService.aggregate(pipeline);
    return documents;
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
