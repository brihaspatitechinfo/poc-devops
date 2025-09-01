import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { SessionStatus } from '../entities/session.entity';

export class UpdateSessionDto {
  @ApiProperty({ 
    example: 'Updated Career Development Coaching',
    description: 'Session title',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Updated session description with additional focus areas',
    description: 'Session description',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: '2024-02-01T14:00:00Z',
    description: 'Updated session scheduled date and time (ISO 8601 format)',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({ 
    example: 90,
    description: 'Updated duration in minutes',
    minimum: 15,
    maximum: 480,
    required: false,
    type: 'number'
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ 
    example: 'https://meet.google.com/new-link-xyz',
    description: 'Updated meeting link (Zoom, Google Meet, etc.)',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  meetingLink?: string;

  @ApiProperty({ 
    example: 'Updated notes with additional materials and preparation requirements',
    description: 'Updated session notes or preparation instructions',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ 
    enum: SessionStatus,
    example: SessionStatus.COMPLETED,
    description: 'Session status',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;
}
