import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ 
    example: 'Career Development Coaching',
    description: 'Session title',
    type: 'string'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Discussing career goals and creating development plan',
    description: 'Session description',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: 'coach-123e4567-e89b-12d3-a456-426614174000',
    description: 'Coach ID',
    type: 'string'
  })
  @IsString()
  coachId: string;

  @ApiProperty({ 
    example: 'coachee-123e4567-e89b-12d3-a456-426614174000',
    description: 'Coachee ID',
    type: 'string'
  })
  @IsString()
  coacheeId: string;

  @ApiProperty({ 
    example: '2024-02-01T10:00:00Z',
    description: 'Session scheduled date and time (ISO 8601 format)',
    type: 'string'
  })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ 
    example: 60,
    description: 'Duration in minutes',
    minimum: 15,
    maximum: 480,
    type: 'number'
  })
  @IsNumber()
  duration: number;

  @ApiProperty({ 
    example: 'https://meet.google.com/abc-defg-hij',
    description: 'Meeting link (Zoom, Google Meet, etc.)',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  meetingLink?: string;

  @ApiProperty({ 
    example: 'Prepare career assessment worksheet and review current job satisfaction survey',
    description: 'Session notes or preparation instructions',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
