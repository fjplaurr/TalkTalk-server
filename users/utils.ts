import type { User } from './types/users';

export function sanitizeUser(user: User | null): Omit<User, 'password'> | null {
  if (!user) {
    return null;
  }
  const { password, ...rest } = user;
  return rest;
}

export function sanitizeUsers(
  users: User[] | null
): Array<Omit<User, 'password'>> {
  if (!users) {
    return [];
  }
  return users.map((user) => sanitizeUser(user) as Omit<User, 'password'>);
}
