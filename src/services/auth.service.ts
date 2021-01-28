import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, TokenData, TokenPayloadData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { isEmptyObject } from '../utils/util';

class AuthService {
  public users = userModel;

  public async signup(userData: UserDto): Promise<User> {
    if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: UserDto): Promise<{ cookies: string[]; findUser: User }> {
    if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const cookies: string[] = [];
    const tokenData = this.createToken(findUser);
    cookies.push(this.createCookie(tokenData));
    const refreshToken = this.createRefreshToken(findUser);
    cookies.push(this.createRefreshCookie(refreshToken));

    return { cookies, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { password: userData.password } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { uuid: user.userId, email: user.email };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60; // 1 hour

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public createRefreshToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { uuid: user.userId, email: user.email };
    const secret: string = process.env.REFRESH_JWT_SECRET;
    const expiresIn: number = 7 * 24 * 60 * 60; // 7 days

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createRefreshCookie(tokenData: TokenData): string {
    return `Refresh=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public refresh(refreshToken: string): { cookies: string[]; userData: User } {
    const refreshTokenData: TokenPayloadData = decodeToken(refreshToken);
    const cookies: string[] = [];
    const userData: User = {
      email: refreshTokenData.email,
      userId: refreshTokenData.uuid,
      password: 'password not important here',
    };
    const jwtToken = this.createToken(userData);
    cookies.push(this.createCookie(jwtToken));
    const newRefreshToken = this.createRefreshToken(userData);
    cookies.push(this.createRefreshCookie(newRefreshToken));

    return { cookies, userData };
  }
}

export function decodeToken(jwtToken): TokenPayloadData {
  const payload = jwt.decode(jwtToken, { json: true }) as TokenPayloadData;
  return payload;
}

export default AuthService;
