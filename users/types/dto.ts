import { User } from './users';

export interface CreateUserDto extends User {}

export interface PutUserDto extends Required<CreateUserDto> {}

export interface PatchUserDto extends Partial<CreateUserDto> {}
