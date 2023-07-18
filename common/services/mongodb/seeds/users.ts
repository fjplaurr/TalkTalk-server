import argon2 from 'argon2';
import { User } from '../../../../users/users.model';

const getUsersSeeds: () => Promise<User[]> = async () => [
  {
    _id: 'user_id1',
    email: 'john@smith.xyz',
    password: await argon2.hash('secret123'),
    firstName: 'John',
    lastName: 'Smith',
    permissionFlags: 0,
    followingUsers: ['user_id2', 'user_id3'],
  },
  {
    _id: 'user_id2',
    email: 'emma@johnson.xyz',
    password: await argon2.hash('secret123'),
    firstName: 'Emma',
    lastName: 'Johnson',
    permissionFlags: 0,
    followingUsers: ['user_id1'],
  },
  {
    _id: 'user_id3',
    email: 'michael@davis.xyz',
    password: await argon2.hash('secret123'),
    firstName: 'Michael',
    lastName: 'Davis',
    permissionFlags: 0,
    followingUsers: ['user_id2, user_id4'],
  },
  {
    _id: 'user_id4',
    email: 'olivia@wilson.xyz',
    password: await argon2.hash('secret123'),
    firstName: 'Olivia',
    lastName: 'Wilson',
    permissionFlags: 0,
    followingUsers: ['user_id2, user_id3'],
  },
];

export { getUsersSeeds };
