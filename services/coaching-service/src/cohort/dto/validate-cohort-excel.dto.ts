import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ValidateCohortExcelDto {

  @IsNotEmpty()
  @IsString()
  ['First Name*']: string;

  @IsNotEmpty()
  @IsString()
  ['Last Name*']: string;

  @IsEmail()
  @IsNotEmpty()
  ['Email*']: string;

  @IsNotEmpty()
  @IsString()
  ['Country Dial Code*']: string;

  @IsNotEmpty()
  @IsString()
  ['Phone No*']: string;

  @IsNotEmpty()
  @IsString()
  ['Gender*']: string;

  @IsNotEmpty()
  @IsNumber()
  ['Total Years of Experience*']: number;

  @IsNotEmpty()
  @IsString()
  ['Country*']: string;

  @IsNotEmpty()
  @IsString()
  ['Level*']: string;

  // Optional fields after 'level'
  @IsOptional()
  @IsString()
  industryType?: string;

  @IsOptional()
  @IsString()
  functionalArea?: string;

  @IsOptional()
  @IsString()
  currentRoleOrDesignation?: string;

  @IsOptional()
  @IsString()
  businessAndTechSkills?: string;

  @IsOptional()
  @IsString()
  softSkills?: string;

  @IsOptional()
  @IsString()
  linkedInLink?: string;
}
