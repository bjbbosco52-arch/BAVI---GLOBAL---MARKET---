import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(2) fullName: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @Matches(/^\+?[0-9]{9,15}$/) phone?: string;
  @IsString() @MinLength(10) password: string;
}

export class LoginDto {
  @IsString() identifier: string;
  @IsString() password: string;
}
