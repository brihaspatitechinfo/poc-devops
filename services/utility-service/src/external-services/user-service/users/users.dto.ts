import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  parentId?: number;  

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneDialId: number;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  roleId: string;

  @IsNotEmpty()
  userRole: string;

  @IsOptional()
  status?: number;

  @IsOptional()
  username?: string;
}
