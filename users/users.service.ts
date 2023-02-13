import UsersDao from './users.dao';
import { CreateUserDto } from './dto/create';
import { PatchUserDto } from './dto/patch';

class UsersService {
  async readAll() {
    return UsersDao.readAll();
  }

  async readById(id: string) {
    return UsersDao.readById(id);
  }

  async create(resource: CreateUserDto) {
    return UsersDao.create(resource);
  }

  async updateById(id: string, resource: PatchUserDto) {
    return UsersDao.updateById(id, resource);
  }

  async deleteById(id: string) {
    return UsersDao.deleteById(id);
  }

  async getUserByEmailWithPassword(email: string) {
    return UsersDao.getUserByEmailWithPassword(email);
  }

  async readFollowing(id: string) {
    return UsersDao.readFollowing(id);
  }
}

export default new UsersService();
