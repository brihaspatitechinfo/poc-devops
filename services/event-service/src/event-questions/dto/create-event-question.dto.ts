import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEventQuestionDto {
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsNotEmpty()
    @IsString()
    qKey: string;

    @IsNotEmpty()
    @IsString()
    question: string;

    @IsOptional()
    @IsBoolean()
    isMandatory?: boolean;
} 