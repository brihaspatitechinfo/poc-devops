import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, IsArray, Min, Max, IsEnum, ValidateIf, IsNotEmpty, isNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { MentoringType, CohortStatus, CreationStatus, CohortType, AssignCoachType, SearchOption } from '../enums/cohort.enums';

export class CreateCohortDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  isInternal: boolean;

  @IsOptional()
  @IsNumber()
  organizationId?: number | null;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @IsNotEmpty()
  timezoneId: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  duration?: number;

  @IsArray()
  @Transform(({ value }) => Array.isArray(value) ? value.map(String) : JSON.parse(value).map(String))
  @IsNotEmpty()
  sessionDurations: string[];

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  allowedMentees: number;

  @IsEnum(MentoringType)
  @IsNotEmpty()
  mentoringType: MentoringType;

  @ValidateIf((o) => o.mentoringType === MentoringType.GROUP)
  @IsNumber()
  @Min(2)
  groupSize?: number;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsEnum(CohortStatus)
  status: CohortStatus;

  @IsNumber()
  @Min(0)
  groupCreated: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  mentorsMatched: number;

  @IsEnum(CreationStatus)
  creationStatus: CreationStatus;

  @IsEnum(CohortType)
  @IsNotEmpty()
  cohortType: CohortType;

  @IsEnum(AssignCoachType)
  @IsNotEmpty()
  assignCoachType: AssignCoachType;

  @IsEnum(SearchOption)
  @IsNotEmpty()
  searchOption: SearchOption;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  minPrice: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  maxPrice: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  isFfMandatory: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  isUnlimited: number;

  @IsNumber()
  @Min(0)
  chemistrySessionCount: number;

  @IsNumber()
  chemistrySessionStatus: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  month: number;

  @IsNumber()
  @IsNotEmpty()
  createdBy: number;

  @IsNumber()
  @IsNotEmpty()
  updatedBy: number;

  @IsOptional()
  @IsString()
  corporateName?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  allowedCoachees?: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  noOfInteractions: number;


  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  pricePerSession?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  totalPrice?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  createdByName?: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty() 
  @Transform(({ value }) => Array.isArray(value) ? value.map(String) : JSON.parse(value).map(String))
  metadata?: string[]; // Array of session numbers where feedback is required

  @IsOptional()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  feedbackFrequency?: number; // Can be derived from metadata.length
} 