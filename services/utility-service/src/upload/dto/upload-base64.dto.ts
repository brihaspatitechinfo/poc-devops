import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { UPLOAD_PATHS } from '../../aws/aws.constants';

export class Base64FileDto {
    @ApiProperty({
        description: 'Base64 encoded file data with MIME type prefix',
        example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    })
    @IsString()
    @IsNotEmpty()
    data: string;

    @ApiProperty({
        description: 'Original file name',
        example: 'profile-photo.jpg',
    })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiPropertyOptional({
        description: 'File size in bytes',
        example: 1024,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(10 * 1024 * 1024) // 10MB
    size?: number;
}

export class UploadBase64Dto {
    @ApiProperty({
        description: 'Base64 encoded file data with MIME type prefix',
        example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    })
    @IsString()
    @IsNotEmpty()
    data: string;

    @ApiProperty({
        description: 'Original file name',
        example: 'profile-photo.jpg',
    })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiPropertyOptional({
        description: 'Upload folder path',
        enum: Object.values(UPLOAD_PATHS),
        example: UPLOAD_PATHS.PROFILE_IMAGES,
        default: UPLOAD_PATHS.GENERAL,
    })
    @IsOptional()
    @IsEnum(UPLOAD_PATHS)
    folder?: string = UPLOAD_PATHS.GENERAL;

    @ApiPropertyOptional({
        description: 'File size in bytes',
        example: 1024,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(10 * 1024 * 1024) // 10MB
    size?: number;
}

export class UploadMultipleBase64Dto {
    @ApiProperty({
        description: 'Array of base64 files to upload',
        type: [Base64FileDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Base64FileDto)
    files: Base64FileDto[];

    @ApiPropertyOptional({
        description: 'Upload folder path',
        enum: Object.values(UPLOAD_PATHS),
        example: UPLOAD_PATHS.DOCUMENTS,
        default: UPLOAD_PATHS.GENERAL,
    })
    @IsOptional()
    @IsEnum(UPLOAD_PATHS)
    folder?: string = UPLOAD_PATHS.GENERAL;
}