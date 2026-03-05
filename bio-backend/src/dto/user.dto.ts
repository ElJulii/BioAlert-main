import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateRegisterDto {
     @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(7)
  password: string;

  // @IsOptional()
  // role?: string; // "user" o "admin"

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean; // por defecto false

  @IsOptional()
  verificationToken?: string; 
}
