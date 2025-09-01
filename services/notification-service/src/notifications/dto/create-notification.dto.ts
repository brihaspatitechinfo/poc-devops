import { IsString, IsEnum, IsOptional, IsObject, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, NotificationPriority } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ 
    description: 'User ID to send notification to',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
    type: 'string'
  })
  @IsString()
  userId: string;

  @ApiProperty({ 
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.EMAIL,
    type: 'string'
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ 
    description: 'Notification title',
    example: 'Course Completion Certificate',
    type: 'string'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    description: 'Notification message',
    example: 'Congratulations! You have successfully completed the JavaScript Fundamentals course. Your certificate is ready for download.',
    type: 'string'
  })
  @IsString()
  message: string;

  @ApiProperty({ 
    description: 'Notification priority',
    enum: NotificationPriority,
    example: NotificationPriority.MEDIUM,
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiProperty({ 
    description: 'Recipient (email, phone, device token, etc.)',
    example: 'john.doe@example.com',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  recipient?: string;

  @ApiProperty({ 
    description: 'Additional metadata',
    example: {
      courseId: 'course-123e4567-e89b-12d3-a456-426614174000',
      courseTitle: 'JavaScript Fundamentals',
      certificateUrl: 'https://weace.com/certificates/user-123/course-456',
      completionDate: '2024-01-15T10:30:00Z'
    },
    required: false,
    type: 'object'
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiProperty({ 
    description: 'Schedule notification for later (ISO 8601 format)',
    example: '2024-01-16T09:00:00Z',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
