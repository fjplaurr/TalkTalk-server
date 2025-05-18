import argon2 from 'argon2';
import UsersDao from '@users/users.dao';
import type { UpdateResult, DeleteResult } from 'mongodb';
import type { CreateUserPayload, PatchUserPayload } from './types/dto';
import type { User } from './types/users';

class UsersService {
  async readAll(): Promise<User[] | null> {
    return UsersDao.readAll();
  }

  async readById(id: string): Promise<User | null> {
    return UsersDao.readById(id);
  }

  async create(resource: CreateUserPayload): Promise<string> {
    const hashedPassword = await argon2.hash(resource.password);
    const resourceWithHashedPassword: CreateUserPayload = {
      ...resource,
      password: hashedPassword,
    };
    return UsersDao.create(resourceWithHashedPassword);
  }

  async updateById(
    id: string,
    resource: PatchUserPayload
  ): Promise<UpdateResult | null> {
    return UsersDao.updateById(id, resource);
  }

  async deleteById(id: string): Promise<DeleteResult | null> {
    return UsersDao.deleteById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return UsersDao.getUserByEmail(email);
  }

  async readFollowing(id: string): Promise<string[]> {
    return UsersDao.readFollowing(id);
  }

  async followUser(
    user: User,
    followedUserId: string
  ): Promise<UpdateResult | null> {
    return UsersDao.updateById(user._id, {
      followingUsers: [...user.followingUsers, followedUserId],
    });
  }
}

export default new UsersService();
