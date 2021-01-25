import { Request } from 'express';
import { User } from './users.interface';

export interface DataStoredInToken {
  uuid: string;
  email: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface TokenPayloadData {
  uuid: string;
  email: string;
  iat: number;
  exp: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
