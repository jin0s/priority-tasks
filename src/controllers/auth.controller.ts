import { NextFunction, Request, Response } from 'express';
import { UserDto } from '../dtos/users.dto';
import AuthService from '../services/auth.service';
import { User } from '../interfaces/users.interface';
import { RequestWithUser } from '../interfaces/auth.interface';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: UserDto = req.body;

    try {
      const signUpUserData: User = await this.authService.signup(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: UserDto = req.body;

    try {
      const { cookies, findUser } = await this.authService.login(userData);
      res.setHeader('Set-Cookie', cookies);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: User = req.user;

    try {
      const logOutUserData: User = await this.authService.logout(userData);
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0', 'Refresh=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.Refresh;

    try {
      const { cookies, userData } = this.authService.refresh(refreshToken);
      res.setHeader('Set-Cookie', cookies);
      res.status(200).json({ data: userData, message: 'refresh' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
