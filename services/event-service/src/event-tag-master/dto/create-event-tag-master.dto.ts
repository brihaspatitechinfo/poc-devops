import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventTagMasterDto {
    @ApiProperty({
        description: 'The tag name',
        example: 'Technology',
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    tag: string;

    @ApiPropertyOptional({
        description: 'Whether this tag is preferred',
        example: false,
        default: false
    })
    @IsOptional()
    @IsNumber()
    isPreferred?: number;
} 