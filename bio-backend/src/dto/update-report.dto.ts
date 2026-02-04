import { IsDate, IsOptional, IsString, IsEnum } from "class-validator";

export enum ReportStateDto {
    PENDING= 'PENDING',
    IN_PROGRESS= 'IN_PROGRESS',
    RESOLVED= 'RESOLVED',
    REJECTED= 'REJECTED'
}

export class UpdateReportDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    animal?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    country?: string

    @IsString()
    @IsOptional()
    city?: string

    @IsString()
    @IsOptional()
    address?: string

    @IsString()
    @IsOptional()
    date: string

    @IsOptional()
    @IsEnum(ReportStateDto)
    state?: ReportStateDto
}