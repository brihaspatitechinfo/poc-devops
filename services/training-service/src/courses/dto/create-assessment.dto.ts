import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsArray, Min, Max } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ 
    description: 'Question text',
    example: 'What is the correct way to declare a variable in JavaScript?',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ 
    enum: ['multiple_choice', 'true_false', 'text'], 
    description: 'Question type',
    example: 'multiple_choice',
    type: 'string'
  })
  @IsEnum(['multiple_choice', 'true_false', 'text'])
  type: string;

  @ApiProperty({ 
    description: 'Answer options for multiple choice questions',
    example: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'variable x = 5;'],
    required: false,
    type: 'array'
  })
  @IsArray()
  @IsOptional()
  options?: string[];

  @ApiProperty({ 
    description: 'Correct answer',
    example: 'let x = 5;',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @ApiProperty({ 
    description: 'Points for this question',
    example: 5,
    default: 1,
    minimum: 1,
    type: 'number'
  })
  @IsNumber()
  @Min(1)
  points: number;
}

export class CreateAssessmentDto {
  @ApiProperty({ 
    description: 'Assessment title',
    example: 'JavaScript Fundamentals Assessment',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: 'Assessment description',
    example: 'Comprehensive assessment covering JavaScript basics including variables, functions, and control structures.',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    description: 'Instructor/trainer ID',
    example: 'instructor-123e4567-e89b-12d3-a456-426614174000',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty({ 
    enum: ['technical', 'business', 'personal'], 
    description: 'Assessment category',
    example: 'technical',
    type: 'string'
  })
  @IsEnum(['technical', 'business', 'personal'])
  category: string;

  @ApiProperty({ 
    enum: ['beginner', 'intermediate', 'advanced'], 
    description: 'Difficulty level',
    example: 'beginner',
    type: 'string'
  })
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty: string;

  @ApiProperty({ 
    description: 'Duration in minutes',
    example: 45,
    default: 30,
    minimum: 1,
    type: 'number'
  })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ 
    description: 'Passing score percentage',
    example: 75,
    default: 70,
    minimum: 0,
    maximum: 100,
    type: 'number'
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore: number;

  @ApiProperty({ 
    description: 'Assessment questions',
    type: [CreateQuestionDto],
    example: [
      {
        question: 'What is the correct way to declare a variable in JavaScript?',
        type: 'multiple_choice',
        options: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'variable x = 5;'],
        correctAnswer: 'let x = 5;',
        points: 5
      },
      {
        question: 'JavaScript is a strongly typed language.',
        type: 'true_false',
        correctAnswer: 'false',
        points: 3
      }
    ]
  })
  @IsArray()
  @IsOptional()
  questions?: CreateQuestionDto[];
} 