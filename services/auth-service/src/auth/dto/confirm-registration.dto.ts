import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmRegistrationDto {
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
} 