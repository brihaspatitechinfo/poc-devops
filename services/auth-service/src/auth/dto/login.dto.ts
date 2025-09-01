import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'john.doe@example.com',
    description: 'User email address',
    type: 'string'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecurePassword123!',
    description: 'User password',
    type: 'string'
  })
  @IsString()
  password: string;
}
