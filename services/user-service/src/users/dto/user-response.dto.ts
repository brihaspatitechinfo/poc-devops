import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '507f1f77bcf86cd799439011'
  })
  _id: string;

  // Corporate admin details
  @ApiProperty({
    description: 'Company logo file path/URL',
    example: 'uploads/logos/company-logo.png'
  })
  companyLogo?: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John'
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe'
  })
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@xyz.com'
  })
  email: string;

  @ApiProperty({
    description: 'Role permissions',
    example: ['user:view', 'user:edit']
  })
  rolePermissions: string[];

  @ApiProperty({
    description: 'Dial code ID for phone number',
    example: 1
  })
  dialCodeId: number;

  @ApiProperty({
    description: 'Phone number',
    example: '1234567890'
  })
  phone: string;

  @ApiProperty({
    description: 'User designation/title',
    example: 'HR Manager'
  })
  designation?: string;

  @ApiProperty({
    description: 'Alternate email address',
    example: 'john.alternate@email.com'
  })
  alternateEmail?: string;

  // Company details
  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corporation'
  })
  companyName: string;

  @ApiProperty({
    description: 'Company overview',
    example: 'HR solutions provider focused on DEI and talent development.'
  })
  companyOverview?: string;

  @ApiProperty({
    description: 'Tax identification number',
    example: 'PAN1234567A'
  })
  taxIdentification?: string;

  @ApiProperty({
    description: 'Office phone number',
    example: '(555) 123-4567'
  })
  officeNumber?: string;

  @ApiProperty({
    description: 'Company headquarters address',
    example: 'San Francisco, CA, USA'
  })
  companyHeadquarters?: string;

  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011'
  })
  userId: string;

  @ApiProperty({
    description: 'Role ID',
    example: '507f1f77bcf86cd799439011'
  })
  roleId: string;

  @ApiProperty({
    description: 'Country',
    example: 'India'
  })
  country: string;

  @ApiProperty({
    description: 'State/Province/Region',
    example: 'Uttar Pradesh'
  })
  state?: string;

  @ApiProperty({
    description: 'City/Town',
    example: 'Agra'
  })
  city?: string;

  @ApiProperty({
    description: 'Pin/Postal code',
    example: '94105'
  })
  pinCode?: string;

  @ApiProperty({
    description: 'Corporate currency',
    example: 'USD',
    enum: ['USD', 'AED', 'GBP', 'INR']
  })
  corporateCurrency: string;

  @ApiProperty({
    description: 'Whether to create company page',
    example: false
  })
  createCompanyPage: boolean;

  @ApiProperty({
    description: 'Company headline',
    example: 'Leading provider of digital learning platforms'
  })
  companyHeadline?: string;

  @ApiProperty({
    description: 'Products and services',
    example: 'Custom e-learning modules, talent acquisition software, career coaching services'
  })
  productsServices?: string;

  @ApiProperty({
    description: 'DEI culture and policies',
    example: 'Our DEI culture fosters belonging and equity—supported by inclusive hiring, unconscious bias training, flexible work policies, and accessibility accommodations.'
  })
  deiCulturePolicies?: string;

  @ApiProperty({
    description: 'Industry',
    example: 'Technology'
  })
  industry?: string;

  @ApiProperty({
    description: 'Website link',
    example: 'www.example.com'
  })
  websiteLink?: string;

  @ApiProperty({
    description: 'Video link',
    example: 'https://youtube.com/watch?v=example'
  })
  videoLink?: string;


  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'ID of user who created this user',
    example: '507f1f77bcf86cd799439011'
  })
  createdBy?: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  organisationId?: Types.ObjectId;

  @ApiProperty({ example: '2025-07-11T10:00:00.000Z' })
  firstLoginAt?: Date;

  @ApiProperty({
    description: 'Whether user should re-login',
    example: false
  })
  shouldReLogin: boolean;

  @ApiProperty({
    description: 'Reset password token',
    example: 'reset_token_123'
  })
  resetPasswordToken?: string;

  @ApiProperty({
    description: 'Reset password token expiration',
    example: '2023-01-01T00:00:00.000Z'
  })
  resetPasswordExpires?: Date;

  @ApiProperty({
    description: 'Soft delete timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  deletedAt?: Date;

  @ApiProperty({ example: '2025-07-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-10T15:30:00.000Z' })
  updatedAt: Date;
}
