import type { User } from '@users/types/users';
import type { Post } from '@posts/types/posts';
import { getPostsSeeds } from './posts';
import { getUsersSeeds } from './users';

type Seeds = { collectionName: string; data: (User | Post)[] }[];
type GetSeeds = () => Seeds;

const getSeeds: GetSeeds = () => {
  const seeds = [
    {
      collectionName: 'users',
      data: getUsersSeeds(),
    },
    {
      collectionName: 'posts',
      data: getPostsSeeds(),
    },
  ];

  return seeds;
};

type GetSeedsReturnType = ReturnType<typeof getSeeds>;

export { getSeeds, GetSeedsReturnType };
