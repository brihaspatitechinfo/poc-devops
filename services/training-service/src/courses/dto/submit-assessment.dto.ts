import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class SubmitAssessmentDto {
  @ApiProperty({ 
    description: 'User ID submitting the assessment',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ 
    description: 'User answers to questions (question ID to answer mapping)',
    example: { 
      'question-1': 'let x = 5;',
      'question-2': 'false',
      'question-3': 'A function is a reusable block of code that performs a specific task.'
    },
    type: 'object'
  })
  @IsObject()
  answers: { [questionId: string]: string };
} 