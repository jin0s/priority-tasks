import { IsString, IsEmail } from 'class-validator';

export class UserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
