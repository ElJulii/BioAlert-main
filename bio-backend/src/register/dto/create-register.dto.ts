import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateRegisterDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    surname: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(7)
    password: string;
}
