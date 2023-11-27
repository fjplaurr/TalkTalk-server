import { Request } from 'express';
// eslint-disable-next-line import/no-unresolved
import { ParamsDictionary } from 'express-serve-static-core';

import { User } from './users';

export interface CreateUserPayload
  extends Pick<User, 'password' | 'email' | 'firstName' | 'lastName'> {}
export interface PatchUserPayload extends Partial<User> {}
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
