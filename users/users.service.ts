import argon2 from 'argon2';
import UsersDao from './users.dao';
import { CreateUserPayload, PatchUserPayload } from './types/dto';

class UsersService {
  async readAll() {
    return UsersDao.readAll();
  }

  async readById(id: string) {
    return UsersDao.readById(id);
  }

  async create(resource: CreateUserPayload) {
    const hashedPassword = await argon2.hash(resource.password);
    const resourceWithHashedPassword: CreateUserPayload = {
      ...resource,
      password: hashedPassword,
    };
    return UsersDao.create(resourceWithHashedPassword);
  }

  async updateById(id: string, resource: PatchUserPayload) {
    return UsersDao.updateById(id, resource);
  }

  async deleteById(id: string) {
    return UsersDao.deleteById(id);
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }

  async readFollowing(id: string) {
    return UsersDao.readFollowing(id);
  }
}

export default new UsersService();
