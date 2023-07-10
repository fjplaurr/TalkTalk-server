import { posts } from './posts';
import { users } from './users';

const seeds = [
  {
    collectionName: 'posts',
    data: posts,
  },
  {
    collectionName: 'users',
    data: users,
  },
];

export { seeds };
