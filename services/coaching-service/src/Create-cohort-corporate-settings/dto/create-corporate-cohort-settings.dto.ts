export enum YesNo {
  NO = 0,
  YES = 1,
}

import { IsInt, IsNumber, IsOptional, IsArray, IsIn, IsString, IsNotEmpty, Min, Max, ValidateIf, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCorporateCohortSettingsDto {
  @ApiProperty({ description: 'Corporate admin user ID', example: '67' })
  @IsString()
  corporateId: string;

  @ApiProperty({ description: 'How many cohorts this corporate can create', example: 5 })
  @IsInt()
  cohortCount: number;

  @ApiProperty({ description: 'How many mentees can be added', example: 100 })
  @IsInt()
  allowedMentee: number;

  @ApiProperty({ description: 'How many interactions allowed', example: 10 })
  @IsInt()
  noIntraction: number;

  @ApiProperty({ description: 'Cohort type(s): 1=Coaching, 2=Mentoring, [1,2]=Both', example: [1,2], isArray: true, type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsIn([1,2], { each: true })
  cohortType: number[];

  @ApiProperty({ description: 'Coach search type(s): 1=Internal, 0=External, [0,1]=Both', example: [0,1], isArray: true, type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0,1], { each: true })
  coachSearchType: number[];

  @ApiProperty({ description: 'Price per session', example: 5000 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Max price for coach/mentor', example: 10000 })
  @IsNumber()
  coachMaxPrice: number;

  @ApiProperty({ description: 'Is unlimited (1=unlimited, 0=limited)', example: YesNo.NO, enum: YesNo })
  @IsEnum(YesNo)
  isUnlimited: YesNo;

  @ApiPropertyOptional({ description: 'Price for 6 months (required if isUnlimited=0)', example: 25000 })
  @ValidateIf(o => o.isUnlimited === YesNo.NO)
  @IsNumber()
  priceFor6Months?: number;

  @ApiPropertyOptional({ description: 'Price for 12 months (required if isUnlimited=0)', example: 45000 })
  @ValidateIf(o => o.isUnlimited === YesNo.NO)
  @IsNumber()
  priceFor12Months?: number;

  @ApiProperty({ description: 'Session duration keys (allowed durations in minutes)', example: [30,60,90], type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  sessionDurationKeys: number[];

  @ApiProperty({ description: 'Chemistry session status (0=not allowed, 1=allowed)', example: YesNo.YES, enum: YesNo })
  @IsEnum(YesNo)
  chemistrySessionStatus: YesNo;

  @ApiPropertyOptional({ description: 'Chemistry session count (required if chemistrySessionStatus=1)', example: 3 })
  @ValidateIf(o => o.chemistrySessionStatus === YesNo.YES)
  @IsInt()
  @Min(1)
  @Max(10)
  chemistrySessionCount?: number;

  @ApiProperty({ description: 'Enable duration (1=can set session duration, 0=cannot)', example: 1 })
  @IsInt()
  @IsIn([0,1])
  enableDuration: number;

  @ApiProperty({ description: 'Status (1=active, 0=inactive)', example: 1 })
  @IsInt()
  @IsIn([0,1])
  status: number;

  @ApiPropertyOptional({
    description: 'Unlimited prices array (required if isUnlimited=1)',
    example: [
      { month: 6, price: 100 },
      { month: 12, price: 200 }
    ],
    type: 'array',
    items: { type: 'object', properties: { month: { type: 'number' }, price: { type: 'number' } } }
  })
  @IsOptional()
  @IsArray()
  unlimitedPrices?: { month: number; price: number }[];
} 