import * as shortid from 'shortid';
import MongoService from '../common/services/mongodb.service';
import { CreateUserDto } from './dto/create';
import { PatchUserDto } from './dto/patch';
import { PutUserDto } from './dto/put';

class UsersDao {
  constructor() {
    MongoService.setCollection('users');
  }

  async readAll() {
    const documents = await MongoService.readMany({});
    return documents;
  }

  async readById(id: string) {
    return MongoService.readOne({ _id: id });
  }

  async create(userFields: CreateUserDto) {
    const id = shortid.generate();
    MongoService.create({
      ...userFields,
      _id: id,
    });
    return id;
  }

  async updateById(id: string, userFields: PatchUserDto | PutUserDto) {
    return MongoService.update({ _id: id }, userFields);
  }

  async deleteById(id: string) {
    return MongoService.delete({ _id: id });
  }
}

export default new UsersDao();
