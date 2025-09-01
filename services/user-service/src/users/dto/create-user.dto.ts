import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { Types } from 'mongoose';

// Role Dto for user creation
export class RoleDto {
  @ApiProperty({
    description: 'Role ID',
    example: 's8s789s789S78s798S7978s8S778s7788S7',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  role_id: string;

  @ApiProperty({
    description: 'Role slug',
    example: 'corporate_admin',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Sort order for the role',
    example: 1,
    required: true
  })
  @IsNumber()
  sort_order: number;
}


export class CreateUserDto {
  // Corporate admin details
  @ApiProperty({
    description: 'Company logo file path/URL',
    example: 'uploads/logos/company-logo.png',
    required: false
  })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@xyz.com',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  // @IsOptional()
  // @IsMongoId()
  // roleId?: string;

  // @ApiProperty({ example: ['user:view', 'user:edit'] })
  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // directPermissions?: string[];

  // @ApiProperty({ example: ['user:view', 'user:edit'] })
  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // rolePermissions?: string[];

  @ApiProperty({
    example: [
      {
        "role_id": "s8s789s789S78s798S7978s8S778s7788S7",
        "slug": "corporate_admin",
        "sort_order": 1
      }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles?: RoleDto[];

  @ApiProperty({ example: 91 })
  @IsOptional()
  @IsNumber()
  dialCodeId?: number;

  @ApiProperty({
    description: 'Phone number',
    example: '1234567890',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'User designation/title',
    example: 'HR Manager',
    required: false
  })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({
    description: 'Alternate email address',
    example: 'john.alternate@email.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  alternateEmail?: string;

  // Company details
  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corporation',
    required: false
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    description: 'Company overview',
    example: 'HR solutions provider focused on DEI and talent development.',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  companyOverview?: string;

  @ApiProperty({
    description: 'Tax identification number',
    example: 'PAN1234567A',
    required: false
  })
  @IsOptional()
  @IsString()
  taxIdentification?: string;

  @ApiProperty({
    description: 'Office phone number',
    example: '(555) 123-4567',
    required: false
  })
  @IsOptional()
  @IsString()
  officeNumber?: string;

  @ApiProperty({
    description: 'Company headquarters address',
    example: 'San Francisco, CA, USA',
    required: false
  })
  @IsOptional()
  @IsString()
  companyHeadquarters?: string;

  @ApiProperty({
    description: 'Country',
    example: 'United States',
    required: false
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'State/Province/Region',
    example: 'California',
    required: false
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'City/Town',
    example: 'San Francisco',
    required: false
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Pin/Postal code',
    example: '94105',
    required: false
  })
  @IsOptional()
  @IsString()
  pinCode?: string;

  @ApiProperty({
    description: 'Corporate currency',
    example: 'USD',
    enum: ['USD', 'AED', 'GBP', 'INR'],
    default: 'USD',
    required: false
  })
  @IsOptional()
  @IsEnum(['USD', 'AED', 'GBP', 'INR'])
  corporateCurrency?: string;

  @ApiProperty({
    description: 'Whether to create company page',
    example: false,
    default: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  createCompanyPage?: boolean;

  @ApiProperty({
    description: 'Company headline',
    example: 'Leading provider of digital learning platforms',
    required: false
  })
  @IsOptional()
  @IsString()
  companyHeadline?: string;

  @ApiProperty({
    description: 'Products and services',
    example: 'Custom e-learning modules, talent acquisition software, career coaching services',
    required: false,
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  productsServices?: string;

  @ApiProperty({
    description: 'DEI culture and policies',
    example: 'Our DEI culture fosters belonging and equity—supported by inclusive hiring, unconscious bias training, flexible work policies, and accessibility accommodations.',
    required: false,
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  deiCulturePolicies?: string;

  @ApiProperty({
    description: 'Industry',
    example: 'Technology',
    required: false
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({
    description: 'Website link',
    example: 'www.example.com',
    required: false
  })
  @IsOptional()
  @IsUrl()
  websiteLink?: string;

  @ApiProperty({
    description: 'User ID',
    example: '61c3ddfa-e0d1-7016-6a57-fb970924c4ca',
    required: false
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Video link',
    example: 'https://youtube.com/watch?v=example',
    required: false
  })
  @IsOptional()
  @IsUrl()
  videoLink?: string;

  @ApiProperty({
    description: 'Tags',
    example: ['HR', 'mentorship', 'wellness'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];


  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'ID of user who created this user',
    example: '507f1f77bcf86cd799439011',
    required: false
  })
  @IsOptional()
  @IsMongoId()
  createdBy?: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  organisationId?: Types.ObjectId;

  @ApiProperty({ example: '2025-07-11T10:00:00.000Z' })
  @IsOptional()
  firstLoginAt?: Date;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  shouldReLogin?: boolean;

  @ApiProperty({ example: 'reset_token_123' })
  @IsOptional()
  @IsString()
  resetPasswordToken?: string;

  @ApiProperty({ example: '2025-07-13T10:00:00.000Z' })
  @IsOptional()
  resetPasswordExpires?: Date;

  @ApiProperty({ example: '2025-07-14T10:00:00.000Z' })
  @IsOptional()
  deletedAt?: Date;
}
