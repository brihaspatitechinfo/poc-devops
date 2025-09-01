import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ 
    example: 'Full Stack JavaScript Development',
    description: 'Course title',
    type: 'string'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Complete course covering frontend and backend JavaScript development with modern frameworks and best practices.',
    description: 'Course description',
    type: 'string'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: 'instructor-123e4567-e89b-12d3-a456-426614174000',
    description: 'Instructor ID',
    type: 'string'
  })
  @IsString()
  instructorId: string;

  @ApiProperty({ 
    example: 499.99,
    description: 'Course price in USD',
    minimum: 0,
    type: 'number'
  })
  @IsNumber()
  price: number;

  @ApiProperty({ 
    example: 40,
    description: 'Course duration in hours',
    minimum: 1,
    type: 'number'
  })
  @IsNumber()
  duration: number;

  @ApiProperty({ 
    enum: ['beginner', 'intermediate', 'advanced'], 
    example: 'intermediate',
    description: 'Course difficulty level',
    type: 'string'
  })
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  level: string;

  @ApiProperty({ 
    enum: ['technical', 'business', 'personal'], 
    example: 'technical',
    description: 'Course category',
    type: 'string'
  })
  @IsEnum(['technical', 'business', 'personal'])
  category: string;
}
