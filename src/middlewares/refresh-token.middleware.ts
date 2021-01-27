import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';
import userModel from '../models/users.model';

async function refreshTokenMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const cookies = req.cookies;

  if (cookies && cookies.Refresh) {
    const secret = process.env.REFRESH_JWT_SECRET;

    try {
      const verificationResponse = jwt.verify(cookies.Refresh, secret) as DataStoredInToken;
      const userId = verificationResponse.uuid;
      const findUser = await userModel.findByPk(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong refresh token'));
      }
    } catch (error) {
      next(new HttpException(401, 'Wrong refresh token'));
    }
  } else {
    next(new HttpException(404, 'Refresh token missing'));
  }
}

export default refreshTokenMiddleware;
