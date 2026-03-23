import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PublicationDTO {

    @IsOptional()
    @IsString()
    idReport?: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    place: string;
}