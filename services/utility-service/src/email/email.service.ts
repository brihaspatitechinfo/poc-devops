import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    attachments?: Array<{
        filename: string;
        content: string | Buffer;
        contentType?: string;
    }>;
}

export interface EmailTemplate {
    subject: string;
    html: string;
    text?: string;
}

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter | null = null;
    constructor(private configService: ConfigService) { }
    private async initializeTransporter() {
        if (!this.transporter) {
            try {
                this.transporter = nodemailer.createTransport({
                    host: this.configService.get<string>('MAIL_HOST'),
                    port: this.configService.get<number>('MAIL_PORT'),
                    secure: false,
                    auth: {
                        user: this.configService.get<string>('MAIL_USERNAME'),
                        pass: this.configService.get<string>('MAIL_PASSWORD'),
                    },
                });
                await this.transporter.verify();
                this.logger.log('Email transporter is ready to send messages');
            } catch (error) {
                this.logger.error('Failed to initialize email transporter:', error);
                this.transporter = {
                    sendMail: async () => {
                        this.logger.warn('Email service not available - using mock transporter');
                        return { messageId: 'mock-message-id' };
                    },
                } as any;
            }
        }
        return this.transporter;
    }


    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const transporter = await this.initializeTransporter();
            const mailOptions: nodemailer.SendMailOptions = {
                from: {
                    name: this.configService.get<string>('MAIL_FROM_NAME', 'WeAce Team'),
                    address: this.configService.get<string>('MAIL_FROM_EMAIL', 'noreply@weace.com'),
                },
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                attachments: options.attachments,
            };
            const info = await transporter.sendMail(mailOptions);
            console.log(info, 'mailInfomation');
            this.logger.log(`Email sent successfully: ${info.messageId}`);
            return true;
        } catch (error) {
            this.logger.error('Failed to send email:', error);
            return false;
        }
    }

    async sendNotificationEmail(to: string, title: string, message: string): Promise<boolean> {
        const template: EmailTemplate = {
            subject: title,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${title}</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px;">
            ${message}
          </div>
          <br>
          <p>Best regards,<br>The WeAce Team</p>
        </div>
      `,
            text: `${title}\n\n${message}`,
        };

        return this.sendEmail({
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }

    async sendBulkEmail(
        recipients: string[],
        template: EmailTemplate,
    ): Promise<{ success: string[]; failed: string[] }> {
        const results = { success: [] as string[], failed: [] as string[] };

        for (const recipient of recipients) {
            const success = await this.sendEmail({
                to: recipient,
                subject: template.subject,
                html: template.html,
                text: template.text,
            });

            if (success) {
                results.success.push(recipient);
            } else {
                results.failed.push(recipient);
            }
        }

        this.logger.log(
            `Bulk email sent: ${results.success.length} successful, ${results.failed.length} failed`,
        );
        return results;
    }
}
