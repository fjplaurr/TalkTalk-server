import shortid from 'shortid';
import MongoService from '../common/services/mongodb.service';
import { CreateUserDto } from './dto/create';
import { PatchUserDto } from './dto/patch';
import { PutUserDto } from './dto/put';

const COLLECTION_NAME = 'users';
class UsersDao {
  async readAll() {
    MongoService.setCollection(COLLECTION_NAME);
    const documents = await MongoService.readMany({});
    return documents;
  }

  async readById(id: string) {
    MongoService.setCollection(COLLECTION_NAME);
    return MongoService.readOne({ _id: id });
  }

  async create(userFields: CreateUserDto) {
    MongoService.setCollection(COLLECTION_NAME);
    const id = shortid.generate();
    MongoService.create({
      ...userFields,
      _id: id,
    });
    return id;
  }

  async updateById(id: string, userFields: PatchUserDto | PutUserDto) {
    MongoService.setCollection(COLLECTION_NAME);
    return MongoService.update({ _id: id }, userFields);
  }

  async deleteById(id: string) {
    MongoService.setCollection(COLLECTION_NAME);
    return MongoService.delete({ _id: id });
  }

  async getUserByEmailWithPassword(email: string) {
    MongoService.setCollection(COLLECTION_NAME);
    const document = await MongoService.readOne({ email });
    return document;
  }

  async readFollowing(id: string) {
    MongoService.setCollection(COLLECTION_NAME);

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

    const documents = await MongoService.aggregate(pipeline);
    return documents;
  }
}

export default new UsersDao();
