import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AttachmentDto {
    @ApiProperty({ description: 'Filename for the attachment' })
    @IsString()
    @IsNotEmpty()
    filename: string;

    @ApiProperty({ description: 'Content of the attachment' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({ description: 'Content type of the attachment' })
    @IsOptional()
    @IsString()
    contentType?: string;
}

export class SendEmailDto {
    @ApiProperty({ description: 'Recipient email address(es)', example: 'user@example.com' })
    @IsEmail({}, { each: true })
    @IsArray()
    to: string[];

    @ApiProperty({ description: 'Email subject', example: 'Welcome to WeAce!' })
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiPropertyOptional({ description: 'HTML content of the email' })
    @IsOptional()
    @IsString()
    html?: string;

    @ApiPropertyOptional({ description: 'Plain text content of the email' })
    @IsOptional()
    @IsString()
    text?: string;

    @ApiPropertyOptional({ description: 'Email attachments', type: [AttachmentDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttachmentDto)
    attachments?: AttachmentDto[];
}

export class SendWelcomeEmailDto {
    @ApiProperty({ description: 'Recipient email address', example: 'user@example.com' })
    @IsEmail()
    to: string;

    @ApiProperty({ description: 'User name for personalization', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    userName: string;
}

export class SendPasswordResetEmailDto {
    @ApiProperty({ description: 'Recipient email address', example: 'user@example.com' })
    @IsEmail()
    to: string;

    @ApiProperty({ description: 'Password reset token', example: 'abc123def456' })
    @IsString()
    @IsNotEmpty()
    resetToken: string;
}

export class SendNotificationEmailDto {
    @ApiProperty({ description: 'Recipient email address', example: 'user@example.com' })
    @IsEmail()
    to: string;

    @ApiProperty({ description: 'Notification title', example: 'New Training Available' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Notification message', example: 'A new training course is now available for you.' })
    @IsString()
    @IsNotEmpty()
    message: string;
}

export class SendBulkEmailDto {
    @ApiProperty({ description: 'List of recipient email addresses', example: ['user1@example.com', 'user2@example.com'] })
    @IsEmail({}, { each: true })
    @IsArray()
    recipients: string[];

    @ApiProperty({ description: 'Email subject', example: 'Important Update' })
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiPropertyOptional({ description: 'HTML content of the email' })
    @IsOptional()
    @IsString()
    html?: string;

    @ApiPropertyOptional({ description: 'Plain text content of the email' })
    @IsOptional()
    @IsString()
    text?: string;
} 