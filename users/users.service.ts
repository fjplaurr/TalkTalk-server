import UsersDao from './users.dao';

class UsersService {
  async readAll() {
    return UsersDao.readAll();
  }

  async readById(id: string) {
    return UsersDao.readById(id);
  }
}

export default new UsersService();
