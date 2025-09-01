import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateEventTeamDto {
    @IsNotEmpty()
    @IsNumber()
    teamId: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    teamName: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    @MaxLength(500)
    displayImage?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    @MaxLength(500)
    videoLink?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    @MaxLength(500)
    documentLink?: string;

    @IsOptional()
    @IsString()
    videoCaption?: string;

    @IsOptional()
    @IsString()
    ideaCaption?: string;
} 