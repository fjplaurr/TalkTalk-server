import shortid from 'shortid';
import MongoDbService from '../common/services/mongodb/mongodb.service';
import { CreateUserDto } from './dto/create';
import { PatchUserDto } from './dto/patch';
import { PutUserDto } from './dto/put';

const COLLECTION_NAME = 'users';
class UsersDao {
  async readAll() {
    MongoDbService.setCollection(COLLECTION_NAME);
    const documents = await MongoDbService.readMany({});
    return documents;
  }

  async readById(id: string) {
    MongoDbService.setCollection(COLLECTION_NAME);
    return MongoDbService.readOne({ _id: id });
  }

  async create(userFields: CreateUserDto) {
    MongoDbService.setCollection(COLLECTION_NAME);
    const id = shortid.generate();
    MongoDbService.create({
      ...userFields,
      _id: id,
    });
    return id;
  }

  async updateById(id: string, userFields: PatchUserDto | PutUserDto) {
    MongoDbService.setCollection(COLLECTION_NAME);
    return MongoDbService.update({ _id: id }, userFields);
  }

  async deleteById(id: string) {
    MongoDbService.setCollection(COLLECTION_NAME);
    return MongoDbService.delete({ _id: id });
  }

  async getUserByEmailWithPassword(email: string) {
    MongoDbService.setCollection(COLLECTION_NAME);
    const document = await MongoDbService.readOne({ email });
    return document;
  }

  async readFollowing(id: string) {
    MongoDbService.setCollection(COLLECTION_NAME);

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

export default new UsersDao();
