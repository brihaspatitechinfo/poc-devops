import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';

export enum UserRole {
  COACH = 'coach',
  TRAINER = 'trainer',
  COACHEE = 'coachee',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export class RegisterDto {
  @ApiProperty({ 
    example: 'jane.smith@example.com',
    description: 'User email address',
    type: 'string',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecurePassword123!',
    description: 'User password (minimum 8 characters)',
    minLength: 8,
    type: 'string',
    required: true
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({ 
    example: 'Jane',
    description: 'User first name',
    type: 'string',
    required: true
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    example: 'Smith',
    description: 'User last name',
    type: 'string'
  })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    enum: UserRole, 
    example: UserRole.COACHEE,
    description: 'User role in the platform',
    type: 'string'
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ 
    example: '+919345678990',
    description: 'User phone number',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE, required: true })
  @IsEnum(Gender)
  gender?: Gender;
}
