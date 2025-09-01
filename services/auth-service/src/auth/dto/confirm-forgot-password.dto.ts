import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmForgotPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: 'string'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Confirmation code sent to email',
    example: '123456',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  confirmationCode: string;

  @ApiProperty({
    description: 'New password (minimum 8 characters)',
    example: 'newPassword123!',
    minLength: 8,
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
} 