import { User } from '../../../../users/users.model';

const users: User[] = [
  {
    _id: 'user_id1',
    email: 'john@smith.xyz',
    password: 'johnsmith',
    firstName: 'John',
    lastName: 'Smith',
    permissionFlags: 0,
    followingUsers: ['user_id2', 'user_id3'],
  },
  {
    _id: 'user_id2',
    email: 'emma@johnson.xyz',
    password: 'emmajohnson',
    firstName: 'Emma',
    lastName: 'Johnson',
    permissionFlags: 0,
    followingUsers: ['user_id1'],
  },
  {
    _id: 'user_id3',
    email: 'michael@davis.xyz',
    password: 'michaeldavis',
    firstName: 'Michael',
    lastName: 'Davis',
    permissionFlags: 0,
    followingUsers: ['user_id2, user_id4'],
  },
  {
    _id: 'user_id4',
    email: 'olivia@wilson.xyz',
    password: 'oliviawilson',
    firstName: 'Olivia',
    lastName: 'Wilson',
    permissionFlags: 0,
    followingUsers: ['user_id2, user_id3'],
  },
];

export { users };
