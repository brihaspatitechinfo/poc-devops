import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({ 
    example: 'Updated Full Stack JavaScript Development',
    description: 'Updated course title',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Updated course description with additional modules and real-world projects.',
    description: 'Updated course description',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: 599.99,
    description: 'Updated course price in USD',
    minimum: 0,
    required: false,
    type: 'number'
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ 
    example: 50,
    description: 'Updated course duration in hours',
    minimum: 1,
    required: false,
    type: 'number'
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ 
    enum: ['beginner', 'intermediate', 'advanced'], 
    example: 'intermediate',
    description: 'Updated course difficulty level',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  level?: string;

  @ApiProperty({ 
    enum: ['technical', 'business', 'personal'], 
    example: 'technical',
    description: 'Updated course category',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsEnum(['technical', 'business', 'personal'])
  category?: string;

  @ApiProperty({ 
    example: true,
    description: 'Course active status',
    required: false,
    type: 'boolean'
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
