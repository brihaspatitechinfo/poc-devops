import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EventSpeakerDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Speaker name',
        type: 'string'
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'Software Engineer',
        description: 'Speaker designation',
        required: false,
        type: 'string'
    })
    @IsOptional()
    @IsString()
    designation?: string;

    @ApiProperty({
        example: 'https://www.linkedin.com/in/john-doe-1234567890',
        description: 'Speaker LinkedIn profile URL',
        required: false,
        type: 'string'
    })
    @IsOptional()
    @IsString()
    linkedinProfile?: string;

    @ApiProperty({
        example: 'https://example.com/images/speaker-1.jpg',
        description: 'Speaker image URL',
        required: false,
        type: 'string'
    })
    @IsOptional()
    @IsString()
    image?: string;
} 