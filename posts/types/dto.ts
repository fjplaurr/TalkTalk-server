import type { Request } from 'express';
// eslint-disable-next-line import/no-unresolved
import type { ParamsDictionary } from 'express-serve-static-core';
import type { Post } from './posts';

export interface CreatePostPayload
  extends Pick<Post, 'text' | 'authorId' | 'date'> {}
export interface PatchPostPayload extends Partial<Post> {}
export interface RequestWithBody<T> extends Request {
  body: T;
}

export interface RequestWithParams<T extends ParamsDictionary> extends Request {
  params: T;
}

export interface RequestWithParamsAndBody<T, U extends ParamsDictionary>
  extends Request {
  body: T;
  params: U;
}
