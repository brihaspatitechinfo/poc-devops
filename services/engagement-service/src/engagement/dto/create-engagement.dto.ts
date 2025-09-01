import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEngagementDto {
  @ApiProperty({ 
    description: 'User ID',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
    type: 'string'
  })
  @IsString()
  userId: string;

  @ApiProperty({ 
    description: 'Engagement type',
    example: 'course_completion',
    enum: ['course_completion', 'assessment_score', 'session_attendance', 'event_participation', 'login_frequency', 'content_interaction'],
    type: 'string'
  })
  @IsString()
  type: string;

  @ApiProperty({ 
    description: 'Engagement value/score (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100,
    type: 'number'
  })
  @IsNumber()
  value: number;

  @ApiPropertyOptional({ 
    description: 'Engagement description',
    example: 'User completed JavaScript Fundamentals course with 85% score',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Additional metadata',
    example: {
      courseId: 'course-123e4567-e89b-12d3-a456-426614174000',
      courseTitle: 'JavaScript Fundamentals',
      completionDate: '2024-01-15T10:30:00Z',
      timeSpent: 120,
      attempts: 1
    },
    type: 'object'
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
} 