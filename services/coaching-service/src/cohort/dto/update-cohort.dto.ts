import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, IsArray, Min, Max, IsEnum, ValidateIf, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { MentoringType, CohortStatus, CreationStatus, CohortType, AssignCoachType, SearchOption } from '../enums/cohort.enums';

export class UpdateCohortDto {

@IsOptional()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  isInternal?: boolean;

  @IsNumber()
  @IsNotEmpty()
  organizationId?: number | null;

  @IsDateString()
  @IsNotEmpty()
  startDate?: string;

  @IsDateString()
  @IsNotEmpty()
  endDate?: string;
  

  @IsNumber()
  @IsNotEmpty()
  timezoneId?: number;
  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsArray()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(value) ? value.map(String) : [];
  })
  sessionDurations?: string[];

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  allowedMentees?: number;

  @IsEnum(MentoringType)
  @IsNotEmpty()
  mentoringType?: MentoringType;

  @ValidateIf((o) => o.mentoringType === MentoringType.GROUP)
  @IsNumber()
  @Min(2)
  groupSize?: number;

  @IsString()
  @IsNotEmpty()
  price?: string;

  @IsEnum(CohortStatus)
  @IsNotEmpty()
  status?: CohortStatus;

  @IsNumber()
  @Min(0)
  groupCreated?: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  mentorsMatched?: number;


  @IsEnum(CohortType)
  @IsNotEmpty()
  cohortType?: CohortType;

  @IsEnum(AssignCoachType)
  @IsNotEmpty()
  assignCoachType?: AssignCoachType;

  @IsEnum(SearchOption)
  @IsNotEmpty()
  searchOption?: SearchOption;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  maxPrice?: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  isFfMandatory?: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  isUnlimited?: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  chemistrySessionCount?: number;

  @IsNumber()
  @IsNotEmpty()
  chemistrySessionStatus?: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  month?: number;

  @IsNumber()
  @IsNotEmpty()
  createdBy?: number;

  @IsNumber()
  @IsNotEmpty()
  updatedBy?: number;

  @IsString()
  @IsNotEmpty()
  corporateName?: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  noOfInteractions?: number;


  @IsNumber()
  @IsNotEmpty()
  pricePerSession?: number;

  @IsNumber()
  @IsNotEmpty()
  totalPrice?: number;

  @IsString()
  @IsNotEmpty()
  createdByName?: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(value) ? value.map(String) : [];
  })
  metadata?: string[];
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  feedbackFrequency?: number;
} 