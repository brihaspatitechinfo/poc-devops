import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventQuestionAnswerDto {
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsNotEmpty()
    @IsString()
    qKey: string;

    @IsNotEmpty()
    @IsNumber()
    eventQuestionId: number;

    @IsNotEmpty()
    @IsNumber()
    candidateId: number;

    @IsNotEmpty()
    @IsString()
    answer: string;
} 