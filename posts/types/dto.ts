import { Post } from './posts';

export interface CreatePostDto extends Post {}

export interface PutPostDto extends Required<CreatePostDto> {}

export interface PatchPostDto extends Partial<CreatePostDto> {}
