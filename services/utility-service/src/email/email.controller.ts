import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    SendBulkEmailDto,
    SendEmailDto,
    SendNotificationEmailDto
} from './dto/send-email.dto';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Post('send')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send a custom email' })
    @ApiBody({ type: SendEmailDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Email sent successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid email data' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to send email' })
    async sendEmail(@Body() sendEmailDto: SendEmailDto) {
        const success = await this.emailService.sendEmail({
            to: sendEmailDto.to,
            subject: sendEmailDto.subject,
            html: sendEmailDto.html,
            text: sendEmailDto.text,
            attachments: sendEmailDto.attachments,
        });
        return {
            success,
            message: success ? 'Email sent successfully' : 'Failed to send email',
        };
    }

    @Post('notification')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send notification email' })
    @ApiBody({ type: SendNotificationEmailDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Notification email sent successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid email data' })
    async sendNotificationEmail(@Body() sendNotificationEmailDto: SendNotificationEmailDto) {
        const success = await this.emailService.sendNotificationEmail(
            sendNotificationEmailDto.to,
            sendNotificationEmailDto.title,
            sendNotificationEmailDto.message,
        );

        return {
            success,
            message: success ? 'Notification email sent successfully' : 'Failed to send notification email',
        };
    }

    @Post('bulk')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send bulk emails to multiple recipients' })
    @ApiBody({ type: SendBulkEmailDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Bulk emails sent successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid email data' })
    async sendBulkEmail(@Body() sendBulkEmailDto: SendBulkEmailDto) {
        const template = {
            subject: sendBulkEmailDto.subject,
            html: sendBulkEmailDto.html,
            text: sendBulkEmailDto.text,
        };

        const results = await this.emailService.sendBulkEmail(
            sendBulkEmailDto.recipients,
            template,
        );

        return {
            success: results.success.length > 0,
            message: `Bulk email operation completed. ${results.success.length} successful, ${results.failed.length} failed`,
            results,
        };
    }


} 