import { IsString, IsNumber, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStateDto {
  @ApiProperty({
    description: 'State name',
    example: 'Maharashtra',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Country ID this state belongs to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  countryId: number;
} 