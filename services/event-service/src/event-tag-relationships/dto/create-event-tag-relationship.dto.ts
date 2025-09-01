import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventTagRelationshipDto {
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsNotEmpty()
    @IsNumber()
    tagId: number;
} 