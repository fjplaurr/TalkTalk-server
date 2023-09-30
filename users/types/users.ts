export type User = {
  _id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  followingUsers?: string[];
  status?: string;
};
