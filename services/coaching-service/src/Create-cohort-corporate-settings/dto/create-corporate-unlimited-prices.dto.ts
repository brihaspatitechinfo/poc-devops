import { IsString, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCorporateUnlimitedPricesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  corporateId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(60)
  month: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
} 