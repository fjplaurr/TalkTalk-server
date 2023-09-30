import argon2 from 'argon2';
import { User } from '../../../../users/types/users';

const getUsersSeeds: () => Promise<User[]> = async () => [
  {
    _id: 'user_id1',
    email: 'john@smith.xyz',
    password: await argon2.hash('secret123'),
    firstName: 'John',
    lastName: 'Smith',
    followingUsers: ['user_id2', 'user_id3'],
    status: 'Crafting digital magic behind the scenes.',
  },
  {
    _id: 'user_id2',
    email: 'emma@johnson.xyz',
    password: await argon2.hash('secret123'),
    firstName: 'Emma',
    lastName: 'Johnson',
    followingUsers: ['user_id1'],
    status: 'Weaving stories from bits and bytes.',
  },
  {
    _id: 'user_id3',
    email: 'michael@davis.xyz',
    password: await argon2.hash('secret123'),
    firstName: 'Michael',
    lastName: 'Davis',
    followingUsers: ['user_id2, user_id4'],
    status: 'Juggling data to uncover hidden patterns.',
  },
  {
    _id: 'user_id4',
    email: 'olivia@wilson.xyz',
    password: await argon2.hash('secret123'),
    firstName: 'Olivia',
    lastName: 'Wilson',
    followingUsers: ['user_id2, user_id3'],
    status: 'Cooking up something exciting in the data kitchen.',
  },
];

export { getUsersSeeds };
