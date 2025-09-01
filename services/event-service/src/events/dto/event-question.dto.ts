import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EventQuestionDto {
    @ApiProperty({
        example: 'name',
        description: 'Question key',
        type: 'string'
    })
    @IsString()
    qKey: string;

    @ApiProperty({
        example: 'What is your name?',
        description: 'Question text',
        type: 'string'
    })
    @IsString()
    question: string;
} 