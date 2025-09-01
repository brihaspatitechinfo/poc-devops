import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { AWS_CONSTANTS } from './aws.constants';

export interface UploadResult {
    url: string;
    key: string;
    bucket: string;
    size: number;
    mimeType: string;
}

export interface Base64File {
    data: string;
    mimeType: string;
    fileName: string;
    size: number;
}

@Injectable()
export class AwsService {

    private s3: AWS.S3;
    constructor(private configService: ConfigService) {
        this.initializeS3();
        console.log(AWS_CONSTANTS.S3.ACCESS_KEY_ID, AWS_CONSTANTS.S3.SECRET_ACCESS_KEY, AWS_CONSTANTS.S3.REGION, 'AWS_CONSTANTS.S3.REGION');
    }
    private initializeS3(): void {
        this.s3 = new AWS.S3({ accessKeyId: AWS_CONSTANTS.S3.ACCESS_KEY_ID, secretAccessKey: AWS_CONSTANTS.S3.SECRET_ACCESS_KEY, region: AWS_CONSTANTS.S3.REGION });
    }
    private validateBase64Data(base64Data: string): { buffer: Buffer; mimeType: string } {
        try {
            let base64String: string;
            let mimeType: string;

            // Check if it's a data URL format (data:image/png;base64,...)
            const dataUrlMatch = base64Data.match(/^data:([^;]+);base64,(.+)$/);
            if (dataUrlMatch) {
                mimeType = dataUrlMatch[1];
                base64String = dataUrlMatch[2];
            } else {
                // It's a plain base64 string, try to detect MIME type from file extension
                // For now, default to application/octet-stream for plain base64
                mimeType = 'application/octet-stream';
                base64String = base64Data;
            }

            const buffer = Buffer.from(base64String, 'base64');
            
            // Validate file size
            if (buffer.length > AWS_CONSTANTS.S3.MAX_FILE_SIZE) {
                throw new BadRequestException(`File size exceeds maximum limit of ${AWS_CONSTANTS.S3.MAX_FILE_SIZE / (1024 * 1024)}MB`);
            }
            
            // Validate MIME type
            if (!AWS_CONSTANTS.S3.ALLOWED_MIME_TYPES.includes(mimeType)) {
                throw new BadRequestException(`File type ${mimeType} is not allowed. Allowed types: ${AWS_CONSTANTS.S3.ALLOWED_MIME_TYPES.join(', ')}`);
            }
            
            return { buffer, mimeType };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Invalid base64 data format');
        }
    }

    private generateFileName(originalName: string, mimeType: string): string {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = this.getExtensionFromMimeType(mimeType);
        const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        return `${sanitizedName}_${timestamp}_${randomString}.${extension}`;
    }

    private getExtensionFromMimeType(mimeType: string): string {
        const mimeToExt: { [key: string]: string } = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'application/pdf': 'pdf',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'text/plain': 'txt',
            'text/csv': 'csv'
        };

        return mimeToExt[mimeType] || 'bin';
    }

    async uploadBase64File(base64Data: string, fileName: string , folder: string = 'general' , keyChecker?: string): Promise<UploadResult> {
        try {
            const { buffer, mimeType } = this.validateBase64Data(base64Data);
            const uniqueFileName = this.generateFileName(fileName, mimeType);
            const key = keyChecker ?? `${folder}/${uniqueFileName}`;
            // Upload to S3
            const uploadParams: AWS.S3.PutObjectRequest = {
                Bucket: AWS_CONSTANTS.S3.BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: mimeType,
                ACL: 'public-read',
                Metadata: {
                    originalName: fileName,
                    uploadedAt: new Date().toISOString(),
                }
            };
            const result = await this.s3.upload(uploadParams).promise();
            return {
                url: result.Location,
                key: result.Key,
                bucket: result.Bucket,
                size: buffer.length,
                mimeType: mimeType
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to upload file to S3');
        }
    }

    async uploadMultipleBase64Files(
        files: Base64File[],
        folder: string = 'general'
    ): Promise<UploadResult[]> {
        try {
            const uploadPromises = files.map(file =>
                this.uploadBase64File(file.data, file.fileName, folder)
            );

            return await Promise.all(uploadPromises);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to upload multiple files');
        }
    }

    async deleteFile(key: string): Promise<{ message: string }> {
        try {
            const deleteParams: AWS.S3.DeleteObjectRequest = {
                Bucket: AWS_CONSTANTS.S3.BUCKET_NAME,
                Key: key
            };

            await this.s3.deleteObject(deleteParams).promise();
            return { message: 'File deleted successfully' };
        } catch (error) {
            console.error('S3 delete error:', error);
            throw new InternalServerErrorException('Failed to delete file from S3');
        }
    }

    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        try {
            const params: AWS.S3.GetObjectRequest = {
                Bucket: AWS_CONSTANTS.S3.BUCKET_NAME,
                Key: key
            };

            return await this.s3.getSignedUrlPromise('getObject', {
                ...params,
                Expires: expiresIn
            });
        } catch (error) {
            console.error('S3 signed URL error:', error);
            throw new InternalServerErrorException('Failed to generate signed URL');
        }
    }

    async checkFileExists(key: string): Promise<boolean> {
        try {
            const params: AWS.S3.HeadObjectRequest = { Bucket: AWS_CONSTANTS.S3.BUCKET_NAME , Key: key};
            await this.s3.headObject(params).promise();
            return true;
        } catch (error) {
            if (error.code === 'NotFound') {
                return false;
            }
            throw new InternalServerErrorException('Failed to check file existence');
        }
    }
} 