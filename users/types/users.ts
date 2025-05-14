export type UserRole = 'user' | 'admin';

export type User = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  followingUsers: string[];
  status: string;
  pictureSrc: string;
  role: UserRole;
};
