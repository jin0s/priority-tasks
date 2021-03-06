import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { UserDto } from '../dtos/users.dto';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import refreshTokenMiddleware from '../middlewares/refresh-token.middleware';
import validationMiddleware from '../middlewares/validation.middleware';

class AuthRoute implements Route {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validationMiddleware(UserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}/login`, validationMiddleware(UserDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logOut);
    this.router.post(`${this.path}/refresh`, refreshTokenMiddleware, this.authController.refresh);
  }
}

export default AuthRoute;
