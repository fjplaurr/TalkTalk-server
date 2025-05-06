import type { User } from '@users/types/users';

type GetUsersSeeds = () => User[];

const getUsersSeeds: GetUsersSeeds = () => [
  {
    _id: 'user_id1',
    email: 'john@smith.xyz',
    password: '$argon2id$v=19$m=65536,t=3,p=4$someprecomputedhash1',
    firstName: 'John',
    lastName: 'Smith',
    followingUsers: ['user_id2', 'user_id3'],
    status: 'Crafting digital magic behind the scenes.',
    pictureSrc: 'https://placedog.net/600',
  },
  {
    _id: 'user_id2',
    email: 'emma@johnson.xyz',
    password: '$argon2id$v=19$m=65536,t=3,p=4$someprecomputedhash2',
    firstName: 'Emma',
    lastName: 'Johnson',
    followingUsers: ['user_id1'],
    status: 'Weaving stories from bits and bytes.',
    pictureSrc: 'https://placedog.net/590',
  },
  {
    _id: 'user_id3',
    email: 'michael@davis.xyz',
    password: '$argon2id$v=19$m=65536,t=3,p=4$someprecomputedhash3',
    firstName: 'Michael',
    lastName: 'Davis',
    followingUsers: ['user_id2', 'user_id4'],
    status: 'Juggling data to uncover hidden patterns.',
    pictureSrc: 'https://placedog.net/490',
  },
  {
    _id: 'user_id4',
    email: 'olivia@wilson.xyz',
    password: '$argon2id$v=19$m=65536,t=3,p=4$someprecomputedhash4',
    firstName: 'Olivia',
    lastName: 'Wilson',
    followingUsers: ['user_id2', 'user_id3'],
    status: 'Cooking up something exciting in the data kitchen.',
    pictureSrc: 'https://placedog.net/390',
  },
];

export { getUsersSeeds };
