import { Request } from 'express';
import { User } from './users.interface';

export interface DataStoredInToken {
  id?: number;
  uuid: string;
  email: string; 
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
