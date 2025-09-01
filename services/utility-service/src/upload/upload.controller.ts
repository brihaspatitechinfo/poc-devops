import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    ValidationPipe
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UploadBase64Dto, UploadMultipleBase64Dto } from './dto/upload-base64.dto';
import { UploadResponse, UploadService, UploadSingleResponse } from './upload.service';

@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('single')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Upload a single file using base64',
        description: 'Upload a single file to AWS S3 using base64 encoded data',
    })
    @ApiBody({
        type: UploadBase64Dto,
        description: 'Base64 file data and metadata',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'File uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                url: { type: 'string', example: 'https://bucket.s3.amazonaws.com/folder/file.jpg' },
                key: { type: 'string', example: 'folder/file_1234567890_abc123.jpg' },
                bucket: { type: 'string', example: 'we-ace-uploads' },
                size: { type: 'number', example: 1024 },
                mimeType: { type: 'string', example: 'image/jpeg' },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request - Invalid input data',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async uploadSingleFile(@Body(new ValidationPipe({ transform: true })) uploadDto: UploadBase64Dto): Promise<UploadSingleResponse> {
        return await this.uploadService.uploadSingleFile(uploadDto);
    }

    @Post('multiple')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Upload multiple files using base64',
        description: 'Upload multiple files to AWS S3 using base64 encoded data',
    })
    @ApiBody({
        type: UploadMultipleBase64Dto,
        description: 'Array of base64 files and metadata',
    })
    @ApiResponse({
        status: 200,
        description: 'Files uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '3 files uploaded successfully' },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            url: { type: 'string' },
                            key: { type: 'string' },
                            bucket: { type: 'string' },
                            size: { type: 'number' },
                            mimeType: { type: 'string' },
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    async uploadMultipleFiles(
        @Body(new ValidationPipe({ transform: true })) uploadDto: UploadMultipleBase64Dto,
    ): Promise<UploadResponse> {
        return await this.uploadService.uploadMultipleFiles(uploadDto);
    }

    @Delete(':key')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete a file from S3',
        description: 'Delete a file from AWS S3 using its key',
    })
    @ApiParam({
        name: 'key',
        description: 'S3 object key (file path)',
        example: 'folder/file_1234567890_abc123.jpg',
    })
    @ApiResponse({
        status: 200,
        description: 'File deleted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'File deleted successfully' },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    async deleteFile(@Param('key') key: string): Promise<UploadResponse> {
        return await this.uploadService.deleteFile(key);
    }

    @Get('signed-url/:key')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Generate signed URL for file access',
        description: 'Generate a signed URL for temporary access to a file in S3',
    })
    @ApiParam({
        name: 'key',
        description: 'S3 object key (file path)',
        example: 'folder/file_1234567890_abc123.jpg',
    })
    @ApiQuery({
        name: 'expiresIn',
        description: 'URL expiration time in seconds',
        required: false,
        type: Number,
        example: 3600,
    })
    @ApiResponse({
        status: 200,
        description: 'Signed URL generated successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Signed URL generated successfully' },
                data: {
                    type: 'object',
                    properties: {
                        url: { type: 'string', example: 'https://bucket.s3.amazonaws.com/folder/file.jpg?signature=...' },
                        key: { type: 'string', example: 'folder/file_1234567890_abc123.jpg' },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    async getSignedUrl(
        @Param('key') key: string,
        @Query('expiresIn') expiresIn?: number,
    ): Promise<UploadResponse> {
        return await this.uploadService.getSignedUrl(key, expiresIn);
    }

    @Get('exists')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Check if file exists in S3 using query parameter',
        description: 'Check if a file exists in AWS S3 using its key as a query parameter (handles keys with forward slashes)',
    })
    @ApiQuery({
        name: 'key',
        description: 'S3 object key (file path)',
        required: true,
        type: String,
        example: 'profile-images/profile-photo.jpg_1754458291995_279m31u8p58.png',
    })
    @ApiResponse({
        status: 200,
        description: 'File existence check completed',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'File exists' },
                data: {
                    type: 'object',
                    properties: {
                        key: { type: 'string', example: 'profile-images/profile-photo.jpg_1754458291995_279m31u8p58.png' },
                        exists: { type: 'boolean', example: true },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Key parameter is required',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    async checkFileExistsByQuery(@Query('key') key: string): Promise<boolean> {
        if (!key) {
            throw new BadRequestException('Key parameter is required');
        }
        return await this.uploadService.checkFileExists(key);
    }

    @Get('exists/:key')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Check if file exists in S3',
        description: 'Check if a file exists in AWS S3 using its key (URL encode keys with special characters)',
    })
    @ApiParam({
        name: 'key',
        description: 'S3 object key (file path) - must be URL encoded if contains forward slashes',
        example: 'folder%2Ffile_1234567890_abc123.jpg',
    })
    @ApiResponse({
        status: 200,
        description: 'File existence check completed',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'File exists' },
                data: {
                    type: 'object',
                    properties: {
                        key: { type: 'string', example: 'folder/file_1234567890_abc123.jpg' },
                        exists: { type: 'boolean', example: true },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    async checkFileExists(@Param('key') key: string): Promise<boolean> {
        // Decode the URL-encoded key
        const decodedKey = decodeURIComponent(key);
        return await this.uploadService.checkFileExists(decodedKey);
    }

    @Get('config')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get upload configuration',
        description: 'Get upload configuration including allowed file types, max size, and upload paths',
    })
    @ApiResponse({
        status: 200,
        description: 'Upload configuration retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                uploadPaths: {
                    type: 'object',
                    properties: {
                        PROFILE_IMAGES: { type: 'string', example: 'profile-images' },
                        DOCUMENTS: { type: 'string', example: 'documents' },
                        TEMP: { type: 'string', example: 'temp' },
                        GENERAL: { type: 'string', example: 'general' },
                    },
                },
                maxFileSize: { type: 'number', example: 10485760 },
                allowedMimeTypes: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['image/jpeg', 'image/png', 'application/pdf'],
                },
            },
        },
    })
    async getUploadConfig() {
        return {
            uploadPaths: this.uploadService.getUploadPaths(),
            maxFileSize: this.uploadService.getMaxFileSize(),
            allowedMimeTypes: this.uploadService.getAllowedMimeTypes(),
        };
    }
} 