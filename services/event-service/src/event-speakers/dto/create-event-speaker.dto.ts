import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateEventSpeakerDto {
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    designation?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    @MaxLength(500)
    linkedinProfile?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    @MaxLength(500)
    image?: string;
} 