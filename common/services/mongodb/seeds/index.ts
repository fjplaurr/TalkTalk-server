import { getPostsSeeds } from './posts';
import { getUsersSeeds } from './users';
import type { User } from '../../../../users/types/users';
import type { Post } from '../../../../posts/types/posts';

type Seeds = { collectionName: string; data: (User | Post)[] }[];

const getSeeds: () => Promise<Seeds> = async () => {
  const seeds = [
    {
      collectionName: 'posts',
      data: getPostsSeeds(),
    },
    {
      collectionName: 'users',
      data: await getUsersSeeds(),
    },
  ];

  return seeds;
};

export { getSeeds };
