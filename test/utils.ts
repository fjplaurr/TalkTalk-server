import type { CreateUserPayload } from '@users/types/dto';
import shortid from 'shortid';
import UsersService from '@users/users.service';

export const getCreateUserPayload: () => CreateUserPayload = () => ({
  email: `mockUser+${shortid.generate()}@mockUser.com`,
  password: 'mockUser',
  firstName: 'mockFirstName',
  lastName: 'mockLastName',
});

export const createUser = async () => {
  const createUserPayload = getCreateUserPayload();
  const id = await UsersService.create(createUserPayload);
  return { id, createUserPayload };
};
