import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateEventPhotoGalleryDto {
    @ApiProperty({
        example: 1,
        description: 'Event ID',
        type: 'number'
    })
    @IsNumber()
    @IsPositive()
    eventId: number;

    @ApiProperty({
        example: '/uploads/events/photo1.jpg',
        description: 'Path to the image file',
        type: 'string',
        maxLength: 500
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    imagePath: string;
} 