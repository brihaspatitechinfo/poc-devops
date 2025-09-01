import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class UpdateEventPhotoGalleryDto {
    @ApiProperty({
        example: 1,
        description: 'Event ID',
        type: 'number',
        required: false
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    eventId?: number;

    @ApiProperty({
        example: '/uploads/events/updated-photo.jpg',
        description: 'Path to the image file',
        type: 'string',
        maxLength: 500,
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    imagePath?: string;
} 