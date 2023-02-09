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
}

export default new UsersDao();
