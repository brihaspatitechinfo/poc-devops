import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UPLOAD_PATHS } from '../aws/aws.constants';
import { AwsService, Base64File, UploadResult } from '../aws/aws.service';
import { UploadBase64Dto, UploadMultipleBase64Dto } from './dto/upload-base64.dto';

export interface UploadResponse {
    success: boolean;
    message: string;
    data?: UploadResult | UploadResult[];
    error?: string;
}
export interface UploadSingleResponse {
    url: string;
    key: string;
    bucket: string;
    size: number;
    mimeType: string;
}
    
@Injectable()
export class UploadService {
    constructor(private readonly awsService: AwsService) { }

    async uploadSingleFile(uploadDto: UploadBase64Dto): Promise<UploadSingleResponse> {
        try {
            return await this.awsService.uploadBase64File(uploadDto.data , uploadDto.fileName,uploadDto.folder || UPLOAD_PATHS.GENERAL);  
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to upload file');
        }
    }

    async uploadMultipleFiles(uploadDto: UploadMultipleBase64Dto): Promise<UploadResponse> {
        try {
            // Validate all files
            for (const file of uploadDto.files) {
                this.validateBase64Format(file.data);
            }

            // Convert to Base64File format
            const base64Files: Base64File[] = uploadDto.files.map(file => ({
                data: file.data,
                fileName: file.fileName,
                mimeType: this.extractMimeType(file.data),
                size: file.size || this.calculateBase64Size(file.data)
            }));

            // Upload to S3
            const results = await this.awsService.uploadMultipleBase64Files(
                base64Files,
                uploadDto.folder || UPLOAD_PATHS.GENERAL
            );

            return {
                success: true,
                message: `${results.length} files uploaded successfully`,
                data: results
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                return {
                    success: false,
                    message: 'Upload failed',
                    error: error.message
                };
            }

            console.error('Upload service error:', error);
            return {
                success: false,
                message: 'Internal server error during upload',
                error: 'Failed to upload files'
            };
        }
    }

    async deleteFile(key: string): Promise<UploadResponse> {
        try {
            const result = await this.awsService.deleteFile(key);

            return {
                success: true,
                message: result.message
            };
        } catch (error) {
            console.error('Delete file error:', error);
            return {
                success: false,
                message: 'Failed to delete file',
                error: 'Internal server error'
            };
        }
    }

    async getSignedUrl(key: string, expiresIn?: number): Promise<UploadResponse> {
        try {
            const signedUrl = await this.awsService.getSignedUrl(key, expiresIn);

            return {
                success: true,
                message: 'Signed URL generated successfully',
                data: {
                    url: signedUrl,
                    key: key,
                    bucket: '',
                    size: 0,
                    mimeType: ''
                }
            };
        } catch (error) {
            console.error('Signed URL error:', error);
            return {
                success: false,
                message: 'Failed to generate signed URL',
                error: 'Internal server error'
            };
        }
    }

    async checkFileExists(key: string): Promise<boolean> {
        try {
            return await this.awsService.checkFileExists(key);   
        } catch (error) {
            throw new InternalServerErrorException('Failed to check file existence');
        }
    }

    private validateBase64Format(base64Data: string): void {
        if (!base64Data || typeof base64Data !== 'string') {
            throw new BadRequestException('Base64 data is required and must be a string');
        }
        const dataUrlRegex = /^data:([^;]+);base64,/;
        if (!dataUrlRegex.test(base64Data)) {
            throw new BadRequestException('Invalid base64 format. Expected data URL format: data:mime/type;base64,<data>');
        }
        const base64Part = base64Data.replace(/^data:[^;]+;base64,/, '');
        if (!base64Part || base64Part.length === 0) {
            throw new BadRequestException('Base64 data is empty');
        }
        try {
            Buffer.from(base64Part, 'base64');
        } catch (error) {
            throw new BadRequestException('Invalid base64 encoding');
        }
    }

    private extractMimeType(base64Data: string): string {
        const mimeTypeMatch = base64Data.match(/^data:([^;]+);base64,/);
        return mimeTypeMatch ? mimeTypeMatch[1] : 'application/octet-stream';
    }

    private calculateBase64Size(base64Data: string): number {
        const base64Part = base64Data.replace(/^data:[^;]+;base64,/, '');
        return Math.ceil((base64Part.length * 3) / 4);
    }

    getUploadPaths(): { [key: string]: string } {
        return UPLOAD_PATHS;
    }

    getMaxFileSize(): number {
        return 10 * 1024 * 1024; // 10MB
    }

    getAllowedMimeTypes(): string[] {
        return [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv'
        ];
    }
} 