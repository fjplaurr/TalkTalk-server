import MongoService from '../common/services/mongodb.service';

class UsersDao {
  constructor() {
    MongoService.setCollection('users');
  }

  async readAll() {
    const documents = await MongoService.readMany({});
    return documents;
  }

  async readById(userId: string) {
    return MongoService.readOne({ _id: userId });
  }
}

export default new UsersDao();
